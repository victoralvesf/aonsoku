import type { IStructuredLyric } from '@/types/responses/song'

export interface NormalizedAgent {
  id: string
  role: 'main' | 'voice' | 'bg' | 'group' | string
  name?: string
  displayOrder: number // 0 = main (top)
}

export interface NormalizedCue {
  start: number // ms, offset already applied
  end: number // ms, computed via all-or-none rule if missing
  value: string
  byteStart?: number
  byteEnd?: number
}

export interface NormalizedCueLine {
  lineIndex: number
  key: string // e.g. "0:lead" or "0:pos0" — stable identity for rAF hook
  agentId?: string
  agentRole?: string
  displayOrder: number // 0 = main row; ≥1 = secondary (reduced opacity)
  start: number
  end: number
  value: string
  cues: NormalizedCue[]
}

export interface NormalizedLine {
  start?: number // ms, offset applied — canonical line clock
  value: string
  cueLines: NormalizedCueLine[] // zero or more, sorted by displayOrder
}

export interface NormalizedBreak {
  beforeLineIndex: number // line index this break precedes; 0 = intro
  start: number // ms, offset applied
  end: number // ms, offset applied
  dotCount: number
  key: string // e.g. "brk:intro" or "brk:3"
}

export interface NormalizedStructuredLyric {
  lang?: string
  kind: string // defaults to 'main'
  synced: boolean
  agents: NormalizedAgent[]
  lines: NormalizedLine[]
  hasWordTiming: boolean
  breaks: NormalizedBreak[]
}

const DEFAULT_CUE_DURATION_MS = 500
const INSTRUMENTAL_BREAK_THRESHOLD_MS = 3000 // gap >= this triggers an indicator
const MAX_BREAK_DOTS = 60 // above this, dots redistribute (>1s per dot)

const ROLE_PRIORITY: Record<string, number> = {
  main: 0,
  voice: 1,
  bg: 2,
  group: 3,
}

export function pickPrimaryStructuredLyric(
  list: IStructuredLyric[] | undefined,
): IStructuredLyric | undefined {
  if (!list || list.length === 0) return undefined
  return list.find((l) => l.kind === 'main') ?? list[0]
}

export function normalizeStructuredLyric(
  raw: IStructuredLyric,
): NormalizedStructuredLyric {
  const offset = raw.offset ?? 0

  // 1. Normalize agents — sort by role priority then declaration order
  const agents: NormalizedAgent[] = (raw.agents ?? [])
    .map((a, i) => ({ ...a, _decl: i }))
    .sort((a, b) => {
      const pa = ROLE_PRIORITY[a.role] ?? 4
      const pb = ROLE_PRIORITY[b.role] ?? 4
      return pa !== pb ? pa - pb : a._decl - b._decl
    })
    .map((a, displayOrder) => ({
      id: a.id,
      role: a.role,
      name: a.name,
      displayOrder,
    }))

  // 2. Build lines array with empty cueLines
  const lines: NormalizedLine[] = raw.line.map((l) => ({
    start: l.start != null ? l.start + offset : undefined,
    value: l.value,
    cueLines: [],
  }))

  // 3. Walk raw cueLines — NO dedupe, preserve all
  const lineDisplayOrderCounters = new Map<number, number>()

  for (const rawCl of raw.cueLine ?? []) {
    const idx = rawCl.index

    // Skip out-of-bounds
    if (idx < 0 || idx >= lines.length) {
      if (import.meta.env.DEV)
        console.warn('[wordTiming] OOB cueLine index', idx)
      continue
    }

    let rawCues = rawCl.cue
    if (rawCl.cue.length > 500) {
      if (import.meta.env.DEV)
        console.warn('[wordTiming] cueLine.cue truncated to 500')
      rawCues = rawCl.cue.slice(0, 500)
    }

    // Build normalised cue list
    // Determine all-or-none state for `end`
    const allHaveEnd = rawCues.length > 0 && rawCues.every((c) => c.end != null)
    const noneHaveEnd = rawCues.every((c) => c.end == null)
    if (!allHaveEnd && !noneHaveEnd && rawCues.length > 0) {
      if (import.meta.env.DEV)
        console.warn('[wordTiming] mixed cue.end — treating as all-missing')
    }

    const cues: NormalizedCue[] = []
    for (let i = 0; i < rawCues.length; i++) {
      const c = rawCues[i]
      if (c.start == null) continue // skip untimed cues

      const cueStart = c.start + offset

      let cueEnd: number
      if (allHaveEnd) {
        cueEnd = c.end! + offset
      } else {
        const nextStart = rawCues[i + 1]?.start
        const clEnd = rawCl.end != null ? rawCl.end + offset : undefined
        const nextLineStart = lines[idx + 1]?.start
        const defaultEnd = cueStart + DEFAULT_CUE_DURATION_MS
        // Last cue inflates to nextLineStart ONLY when the gap is below the
        // break threshold; otherwise it ends naturally and the break indicator
        // fills the gap. The two conditionals share INSTRUMENTAL_BREAK_THRESHOLD_MS
        // so they cannot disagree.
        if (nextStart != null) {
          cueEnd = nextStart + offset
        } else if (clEnd != null) {
          cueEnd = clEnd
        } else if (
          nextLineStart != null &&
          nextLineStart - defaultEnd < INSTRUMENTAL_BREAK_THRESHOLD_MS
        ) {
          cueEnd = nextLineStart
        } else {
          cueEnd = defaultEnd
        }
      }

      // Defensive byte bounds check
      let byteStart = c.byteStart
      let byteEnd = c.byteEnd
      if (byteStart != null && byteEnd != null && byteStart > byteEnd) {
        if (import.meta.env.DEV)
          console.warn('[wordTiming] byteStart > byteEnd', {
            byteStart,
            byteEnd,
          })
        byteStart = undefined
        byteEnd = undefined
      }

      cues.push({
        start: cueStart,
        end: cueEnd,
        value: c.value ?? '',
        byteStart,
        byteEnd,
      })
    }

    // Resolve agent display order
    const matchedAgent = agents.find((a) => a.id === rawCl.agentId)
    const posCount = lineDisplayOrderCounters.get(idx) ?? 0
    const displayOrder = matchedAgent?.displayOrder ?? posCount
    lineDisplayOrderCounters.set(idx, posCount + 1)

    // Compute cueLine start/end
    const clStartRaw = rawCl.start != null ? rawCl.start + offset : undefined
    const clStart = clStartRaw ?? lines[idx].start ?? cues[0]?.start ?? 0
    const clEndRaw = rawCl.end != null ? rawCl.end + offset : undefined
    const clEnd =
      clEndRaw ?? lines[idx + 1]?.start ?? cues[cues.length - 1]?.end ?? clStart

    const key = `${idx}:${rawCl.agentId ?? `pos${posCount}`}`

    lines[idx].cueLines.push({
      lineIndex: idx,
      key,
      agentId: rawCl.agentId,
      agentRole: matchedAgent?.role,
      displayOrder,
      start: clStart,
      end: clEnd,
      value: rawCl.value,
      cues,
    })
  }

  // 4. Sort each line's cueLines by displayOrder
  for (const line of lines) {
    line.cueLines.sort((a, b) => a.displayOrder - b.displayOrder)
  }

  // 5. Promote main-agent start as canonical line clock
  for (const line of lines) {
    if (line.start == null && line.cueLines.length > 0) {
      line.start = line.cueLines[0].start
    }
  }

  // 6. Compute hasWordTiming
  const hasWordTiming = lines.some(
    (l) => l.cueLines.length > 0 && l.cueLines.some((cl) => cl.cues.length > 0),
  )

  // 7. Detect instrumental breaks (≥3s gaps). Cue-end inflation above is
  //    capped at the same threshold, so cues[last].end is the natural end
  //    whenever a break should be reported.
  const breaks = computeBreaks(lines)

  return {
    lang: raw.lang,
    kind: raw.kind ?? 'main',
    synced: raw.synced,
    agents,
    lines,
    hasWordTiming,
    breaks,
  }
}

function computeBreaks(lines: NormalizedLine[]): NormalizedBreak[] {
  const breaks: NormalizedBreak[] = []

  const lineEnd = (line: NormalizedLine): number | undefined => {
    let max: number | undefined
    for (const cl of line.cueLines) {
      const e = cl.cues[cl.cues.length - 1]?.end
      if (e != null && (max == null || e > max)) max = e
    }
    return max
  }

  const pushIfBreak = (
    beforeLineIndex: number,
    start: number,
    end: number,
    keySuffix: string,
  ) => {
    const gap = end - start
    if (gap < INSTRUMENTAL_BREAK_THRESHOLD_MS) return
    const dotCount = Math.min(
      MAX_BREAK_DOTS,
      Math.max(1, Math.floor(gap / 1000)),
    )
    breaks.push({
      beforeLineIndex,
      start,
      end,
      dotCount,
      key: `brk:${keySuffix}`,
    })
  }

  // Intro: from t=0 to first line's start.
  if (lines.length > 0 && lines[0].start != null) {
    pushIfBreak(0, 0, lines[0].start, 'intro')
  }

  // Mid-song: between consecutive lines, using each line's natural last-cue end.
  for (let i = 1; i < lines.length; i++) {
    const prev = lines[i - 1]
    const curr = lines[i]
    if (curr.start == null) continue
    const prevEnd = lineEnd(prev)
    if (prevEnd == null) continue
    pushIfBreak(i, prevEnd, curr.start, String(i))
  }

  return breaks
}
