import { useEffect, useMemo, useRef, useState } from 'react'

export interface RafTickInfo {
  /** Current playback time in ms (offset already applied upstream by the caller). */
  t: number
  /** -1 when no line has started; else the rightmost-started line index (boundary for past/future). */
  activeLineIdx: number
  /** Asc-sorted indices of all currently-overlapping lines; falls back to [activeLineIdx] in inter-line gaps; empty before first line. */
  activeLineIndices: ReadonlyArray<number>
  /** Map from NormalizedCueLine.key → active cue index. Aggregated across every line in activeLineIndices. */
  activeCueByKey: Readonly<Record<string, number>>
}

export interface UseRafActiveCueArgs {
  lines: ReadonlyArray<{
    start?: number
    end?: number
    cueLines: ReadonlyArray<{
      key: string
      start?: number
      end?: number
      cues: ReadonlyArray<{ start: number; end: number }>
    }>
  }>
  getCurrentTimeMs: () => number
  enabled?: boolean
  /**
   * Fired on EVERY animation frame (when the document is visible), AFTER the
   * active-index binary searches but BEFORE any `setState` calls. This is the
   * side-channel for sub-cue-resolution effects (e.g. karaoke wipe progress)
   * that need a smooth 60fps signal without triggering React re-renders.
   *
   * The callback identity is stored in a ref so changing it on every render is
   * cheap (no RAF restart). Implementations should treat it as fire-and-forget
   * and avoid heavy work inside.
   */
  onTick?: (info: RafTickInfo) => void
}

export interface UseRafActiveCueResult {
  activeLineIdx: number
  /** All currently-active line indices in ascending order. See RafTickInfo for semantics. */
  activeLineIndices: ReadonlyArray<number>
  activeCueByKey: Readonly<Record<string, number>>
  lastVisitedCueByKey: Readonly<Record<string, number>>
}

/**
 * Binary search: returns the index `i` of the greatest `lineStarts[i] <= t`.
 * Returns -1 if `t` is before the first start or the array is empty.
 */
export function findLineIdx(lineStarts: number[], t: number): number {
  let lo = 0
  let hi = lineStarts.length - 1
  let result = -1
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1
    if (lineStarts[mid] <= t) {
      result = mid
      lo = mid + 1
    } else {
      hi = mid - 1
    }
  }
  return result
}

/**
 * Binary search: returns index `i` where `cueStarts[i] <= t < cueEnds[i]`.
 * Returns -1 if `t` is in a gap between cues, before all cues, or after all cues.
 */
export function findCueIdx(
  cueStarts: number[],
  cueEnds: number[],
  t: number,
): number {
  let lo = 0
  let hi = cueStarts.length - 1
  let candidate = -1
  while (lo <= hi) {
    const mid = (lo + hi) >>> 1
    if (cueStarts[mid] <= t) {
      candidate = mid
      lo = mid + 1
    } else {
      hi = mid - 1
    }
  }
  if (candidate >= 0 && t < cueEnds[candidate]) return candidate
  return -1
}

/**
 * Returns asc-sorted indices of every line whose [start, end) range contains t
 * (the cluster of concurrent voices currently sounding). When the playhead sits
 * in an inter-line gap, falls back to `[rightmost]` so a single line stays
 * visually active until the next starts — preserves pre-cluster behaviour for
 * non-overlapping lyrics. Returns `[]` only before the very first line.
 *
 * Uses `prefixMaxEnd` (running max of lineEnds) to bound the backward scan: any
 * `j` with `prefixMaxEnd[j] <= t` proves no line at `j` or earlier can still
 * overlap, terminating the scan early. Per-frame cost is O(cluster size),
 * typically ≤ ~5 even on dense duet sections.
 */
export function findActiveLineIndices(
  lineStarts: number[],
  lineEnds: number[],
  prefixMaxEnd: number[],
  t: number,
): number[] {
  if (lineStarts.length === 0) return []
  const rightmost = findLineIdx(lineStarts, t)
  if (rightmost < 0) return []
  const overlapping: number[] = []
  for (let j = rightmost; j >= 0; j--) {
    if (prefixMaxEnd[j] <= t) break
    if (t < lineEnds[j]) overlapping.push(j)
  }
  if (overlapping.length === 0) return [rightmost]
  overlapping.reverse()
  return overlapping
}

const EMPTY_ACTIVE_INDICES: ReadonlyArray<number> = Object.freeze([])

/**
 * Tracks the currently-active lyric line and the active cue (per agent key)
 * by polling `getCurrentTimeMs()` once per animation frame.
 *
 * - Loop lives inside `useEffect`; cleanup calls `cancelAnimationFrame`.
 * - Skips work when `document.hidden` is true (background tab).
 * - Only calls `setState` when an active index actually changes.
 * - Uses binary search over pre-computed sorted start/end arrays.
 */
export function useRafActiveCue({
  lines,
  getCurrentTimeMs,
  enabled = true,
  onTick,
}: UseRafActiveCueArgs): UseRafActiveCueResult {
  const [activeLineIdx, setActiveLineIdx] = useState(-1)
  const [activeLineIndices, setActiveLineIndices] =
    useState<ReadonlyArray<number>>(EMPTY_ACTIVE_INDICES)
  const [activeCueByKey, setActiveCueByKey] = useState<Record<string, number>>(
    {},
  )
  const [lastVisitedCueByKey, setLastVisitedCueByKey] = useState<
    Record<string, number>
  >({})
  const rafIdRef = useRef<number | null>(null)
  const mountedRef = useRef(true)
  const lineIdxRef = useRef(-1)
  const activeIndicesRef =
    useRef<ReadonlyArray<number>>(EMPTY_ACTIVE_INDICES)
  const cueByKeyRef = useRef<Record<string, number>>({})
  const lastVisitedRef = useRef<Record<string, number>>({})
  const onTickRef = useRef(onTick)
  useEffect(() => {
    onTickRef.current = onTick
  }, [onTick])

  // Pre-compute sorted arrays for binary search (memoized by line identity).
  // lineEnds uses -Infinity for lines lacking an end (cueLine-less placeholder
  // lines): `t < -Infinity` is always false, so such lines are never reported
  // as overlapping. prefixMaxEnd is the running max of lineEnds, used by
  // findActiveLineIndices to bound the backward overlap scan.
  const lineStarts = useMemo(() => lines.map((l) => l.start ?? 0), [lines])
  const lineEnds = useMemo(
    () => lines.map((l) => l.end ?? Number.NEGATIVE_INFINITY),
    [lines],
  )
  const prefixMaxEnd = useMemo(() => {
    const out = new Array<number>(lineEnds.length)
    let max = Number.NEGATIVE_INFINITY
    for (let i = 0; i < lineEnds.length; i++) {
      if (lineEnds[i] > max) max = lineEnds[i]
      out[i] = max
    }
    return out
  }, [lineEnds])
  const cueDataByLine = useMemo(
    () =>
      lines.map((l) =>
        l.cueLines.map((cl) => ({
          key: cl.key,
          starts: cl.cues.map((c) => c.start),
          ends: cl.cues.map((c) => c.end),
        })),
      ),
    [lines],
  )

  useEffect(() => {
    mountedRef.current = true

    if (!enabled || lines.length === 0) {
      setActiveLineIdx(-1)
      setActiveLineIndices(EMPTY_ACTIVE_INDICES)
      setActiveCueByKey({})
      setLastVisitedCueByKey({})
      lineIdxRef.current = -1
      activeIndicesRef.current = EMPTY_ACTIVE_INDICES
      cueByKeyRef.current = {}
      lastVisitedRef.current = {}
      return
    }

    const tick = () => {
      if (!mountedRef.current) return

      // Skip all work in background tabs to avoid wasted CPU.
      if (document.hidden) {
        rafIdRef.current = requestAnimationFrame(tick)
        return
      }

      const t = getCurrentTimeMs()
      // Rightmost-started line: stable back-compat anchor and past/future boundary
      // for the view. activeLineIndices is the cluster overlap set (may equal
      // [activeLineIdx] in gaps, may be multi-element across concurrent voices).
      const newLineIdx = findLineIdx(lineStarts, t)
      const newActiveIndices = findActiveLineIndices(
        lineStarts,
        lineEnds,
        prefixMaxEnd,
        t,
      )
      const newCueByKey: Record<string, number> = {}
      const newLastVisited: Record<string, number> = {}

      // Aggregate cue maps across EVERY active line. Keys are globally unique
      // (line index baked into NormalizedCueLine.key) so collisions are
      // impossible and concurrent voices each keep their own active-cue index.
      for (const lineIdx of newActiveIndices) {
        const cueLines = cueDataByLine[lineIdx]
        if (!cueLines) continue
        for (const cl of cueLines) {
          const cueIdx = findCueIdx(cl.starts, cl.ends, t)
          if (cueIdx >= 0) newCueByKey[cl.key] = cueIdx
          const visitedIdx = findLineIdx(cl.starts, t)
          if (visitedIdx >= 0) newLastVisited[cl.key] = visitedIdx
        }
      }

      onTickRef.current?.({
        t,
        activeLineIdx: newLineIdx,
        activeLineIndices: newActiveIndices,
        activeCueByKey: newCueByKey,
      })

      // Only setState when the active line index actually changes.
      if (newLineIdx !== lineIdxRef.current) {
        lineIdxRef.current = newLineIdx
        if (mountedRef.current) setActiveLineIdx(newLineIdx)
      }

      // activeLineIndices change detection — same-length, same-elements check.
      const prevIndices = activeIndicesRef.current
      const indicesChanged =
        prevIndices.length !== newActiveIndices.length ||
        prevIndices.some((v, i) => v !== newActiveIndices[i])
      if (indicesChanged) {
        activeIndicesRef.current = newActiveIndices
        if (mountedRef.current) setActiveLineIndices(newActiveIndices)
      }

      const prevKeys = Object.keys(cueByKeyRef.current)
      const newKeys = Object.keys(newCueByKey)
      const cueChanged =
        prevKeys.length !== newKeys.length ||
        newKeys.some((k) => cueByKeyRef.current[k] !== newCueByKey[k])
      if (cueChanged) {
        cueByKeyRef.current = newCueByKey
        if (mountedRef.current) setActiveCueByKey(newCueByKey)
      }

      const prevVisKeys = Object.keys(lastVisitedRef.current)
      const newVisKeys = Object.keys(newLastVisited)
      const visChanged =
        prevVisKeys.length !== newVisKeys.length ||
        newVisKeys.some((k) => lastVisitedRef.current[k] !== newLastVisited[k])
      if (visChanged) {
        lastVisitedRef.current = newLastVisited
        if (mountedRef.current) setLastVisitedCueByKey(newLastVisited)
      }

      rafIdRef.current = requestAnimationFrame(tick)
    }

    rafIdRef.current = requestAnimationFrame(tick)

    return () => {
      mountedRef.current = false
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
    }
  }, [
    lines,
    lineStarts,
    lineEnds,
    prefixMaxEnd,
    cueDataByLine,
    getCurrentTimeMs,
    enabled,
  ])

  return {
    activeLineIdx,
    activeLineIndices,
    activeCueByKey,
    lastVisitedCueByKey,
  }
}
