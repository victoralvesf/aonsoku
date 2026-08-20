import { useEffect, useRef, useState } from 'react'

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

const indicesEqual = (
  a: ReadonlyArray<number>,
  b: ReadonlyArray<number>,
): boolean => a.length === b.length && a.every((v, i) => v === b[i])

const recordEqual = (
  a: Record<string, number>,
  b: Record<string, number>,
): boolean => {
  const ka = Object.keys(a)
  const kb = Object.keys(b)
  return ka.length === kb.length && ka.every((k) => a[k] === b[k])
}

/**
 * `useState` + a ref shadow + caller-supplied equality. `commit(next)` only
 * dispatches a setState (and updates the ref) when `next` differs from the
 * previously-committed value. Lets the rAF tick call this every frame and
 * cheaply skip work when nothing has changed.
 */
function useReactiveValue<T>(
  initial: T,
  equal: (a: T, b: T) => boolean = Object.is as (a: T, b: T) => boolean,
): [T, (next: T) => void] {
  const [state, setState] = useState<T>(initial)
  const ref = useRef<T>(initial)
  const commit = (next: T) => {
    if (!equal(ref.current, next)) {
      ref.current = next
      setState(next)
    }
  }
  return [state, commit]
}

/**
 * Tracks the currently-active lyric line and the active cue (per agent key)
 * by polling `getCurrentTimeMs()` once per animation frame.
 *
 * - Loop lives inside `useEffect`; cleanup calls `cancelAnimationFrame`.
 * - Skips work when `document.hidden` is true (background tab).
 * - Only re-renders when an active index actually changes.
 * - Uses binary search over pre-computed sorted start/end arrays.
 */
export function useRafActiveCue({
  lines,
  getCurrentTimeMs,
  enabled = true,
  onTick,
}: UseRafActiveCueArgs): UseRafActiveCueResult {
  const [activeLineIdx, commitActiveLineIdx] = useReactiveValue<number>(-1)
  const [activeLineIndices, commitActiveLineIndices] = useReactiveValue<
    ReadonlyArray<number>
  >(EMPTY_ACTIVE_INDICES, indicesEqual)
  const [activeCueByKey, commitActiveCueByKey] = useReactiveValue<
    Record<string, number>
  >({}, recordEqual)
  const [lastVisitedCueByKey, commitLastVisitedCueByKey] = useReactiveValue<
    Record<string, number>
  >({}, recordEqual)

  // Stable callback ref — lets the caller pass a fresh inline `onTick` each
  // render without restarting the rAF loop.
  const onTickRef = useRef(onTick)
  useEffect(() => {
    onTickRef.current = onTick
  }, [onTick])

  // biome-ignore lint/correctness/useExhaustiveDependencies: commit fns close over stable refs/setStates and don't drive the loop
  useEffect(() => {
    if (!enabled || lines.length === 0) {
      commitActiveLineIdx(-1)
      commitActiveLineIndices(EMPTY_ACTIVE_INDICES)
      commitActiveCueByKey({})
      commitLastVisitedCueByKey({})
      return
    }

    // Pre-compute sorted arrays for binary search. lineEnds uses -Infinity for
    // placeholder lines lacking an end so `t < -Infinity` is always false and
    // those lines are never reported as overlapping. prefixMaxEnd (running max
    // of lineEnds) bounds the backward overlap scan in findActiveLineIndices.
    const lineStarts = lines.map((l) => l.start ?? 0)
    const lineEnds = lines.map((l) => l.end ?? Number.NEGATIVE_INFINITY)
    const prefixMaxEnd = new Array<number>(lineEnds.length)
    {
      let max = Number.NEGATIVE_INFINITY
      for (let i = 0; i < lineEnds.length; i++) {
        if (lineEnds[i] > max) max = lineEnds[i]
        prefixMaxEnd[i] = max
      }
    }
    const cueDataByLine = lines.map((l) =>
      l.cueLines.map((cl) => ({
        key: cl.key,
        starts: cl.cues.map((c) => c.start),
        ends: cl.cues.map((c) => c.end),
      })),
    )

    let rafId = requestAnimationFrame(tick)

    function tick() {
      // Skip all work in background tabs to avoid wasted CPU.
      if (document.hidden) {
        rafId = requestAnimationFrame(tick)
        return
      }

      const t = getCurrentTimeMs()
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

      commitActiveLineIdx(newLineIdx)
      commitActiveLineIndices(newActiveIndices)
      commitActiveCueByKey(newCueByKey)
      commitLastVisitedCueByKey(newLastVisited)

      rafId = requestAnimationFrame(tick)
    }

    return () => {
      cancelAnimationFrame(rafId)
    }
  }, [lines, getCurrentTimeMs, enabled])

  return {
    activeLineIdx,
    activeLineIndices,
    activeCueByKey,
    lastVisitedCueByKey,
  }
}
