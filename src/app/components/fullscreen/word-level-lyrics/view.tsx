import clsx from 'clsx'
import { Fragment, useMemo } from 'react'
import { isSafari } from 'react-device-detect'
import { byteSliceFallback } from '@/utils/byteSlice'
import type {
  NormalizedBreak,
  NormalizedStructuredLyric,
} from '@/utils/wordTiming'

const HUE_ROTATE_CLASSES = [
  '[filter:hue-rotate(180deg)]',
  '[filter:hue-rotate(90deg)]',
  '[filter:hue-rotate(270deg)]',
  '[filter:hue-rotate(45deg)]',
  '[filter:hue-rotate(135deg)]',
  '[filter:hue-rotate(225deg)]',
  '[filter:hue-rotate(315deg)]',
] as const

export interface WordLevelLyricsViewProps {
  data: NormalizedStructuredLyric
  /** -1 when no line has started; else the rightmost-started line index (back-compat anchor for past/future boundary). */
  activeLineIdx: number
  /** Asc-sorted indices of all currently-overlapping (cluster) lines. Optional; defaults to [activeLineIdx] when omitted, preserving single-line behaviour for existing callers. */
  activeLineIndices?: ReadonlyArray<number>
  /** Map from NormalizedCueLine.key → active cue index. Aggregated across every line in activeLineIndices. */
  activeCueByKey: Readonly<Record<string, number>>
  /**
   * Map from NormalizedCueLine.key → greatest cue index whose start time has
   * passed. Stays populated during inter-cue gaps and between-line transitions
   * so previously-visited words keep their `opacity-50` past styling instead
   * of snapping back to the future state.
   */
  lastVisitedCueByKey: Readonly<Record<string, number>>
  /** Non-null when an instrumental break is currently active. Defaults to null. */
  activeBreakInfo?: { breakKey: string; dotIdx: number } | null
  /** Called with the cue's normalised (offset-applied) start time in ms. */
  onWordClick: (cueStartMs: number) => void
  /** Result of resolveLyricsLang(data.lang, langCode) — computed by the container. */
  resolvedLang: string | undefined
  /** Forwarded to the outer scroll container so the container can attach a ref. */
  scrollContainerRef?: React.Ref<HTMLDivElement>
  /** Refs for each LINE CONTAINER <div> by line index — for scroll-into-view. */
  lineRefs?: React.MutableRefObject<(HTMLDivElement | null)[]>
  /** Refs for each BREAK CONTAINER <div> by break.key — for scroll-into-view. */
  breakContainerRefs?: React.MutableRefObject<Map<string, HTMLDivElement>>
  /**
   * Called on mount with the cue <span> element and on unmount with null, keyed
   * by `${lineIdx}|${cueLine.key}|${cueIdx}`. The container uses this to drive
   * the karaoke `--fill` CSS variable directly on each span via rAF, bypassing
   * React state updates so the smooth fill animation doesn't cost re-renders.
   */
  registerWordRef?: (key: string, el: HTMLSpanElement | null) => void
  /**
   * Same DOM-direct --fill pattern as registerWordRef but for break dots,
   * keyed by `${break.key}|${dotIdx}`.
   */
  registerDotRef?: (key: string, el: HTMLSpanElement | null) => void
}

export function WordLevelLyricsView({
  data,
  activeLineIdx,
  activeLineIndices,
  activeCueByKey,
  lastVisitedCueByKey,
  activeBreakInfo = null,
  onWordClick,
  resolvedLang,
  scrollContainerRef,
  lineRefs,
  breakContainerRefs,
  registerWordRef,
  registerDotRef,
}: WordLevelLyricsViewProps) {
  const breaksByLine = new Map<number, NormalizedBreak>()
  for (const brk of data.breaks) {
    breaksByLine.set(brk.beforeLineIndex, brk)
  }
  const isBreakActive = activeBreakInfo !== null
  // Cluster membership set: when activeLineIndices is provided and non-empty
  // we use it directly; otherwise fall back to [activeLineIdx] so existing
  // single-index callers (tests, single-track lyrics) keep working unchanged.
  const activeIndicesSet = useMemo<ReadonlySet<number>>(() => {
    if (activeLineIndices && activeLineIndices.length > 0) {
      return new Set(activeLineIndices)
    }
    return activeLineIdx >= 0 ? new Set([activeLineIdx]) : new Set<number>()
  }, [activeLineIndices, activeLineIdx])

  return (
    <div
      ref={scrollContainerRef}
      data-testid="word-sync-lyrics-box"
      className={clsx(
        'w-full h-full text-center font-semibold text-2xl 2xl:text-3xl px-2 overflow-y-auto',
        !isSafari && 'scroll-smooth',
        'lrc-box maskImage-big-player-lyrics',
      )}
    >
      <div aria-hidden="true" style={{ height: '50%' }} />
      {data.lines.map((line, i) => {
        const precedingBreak = breaksByLine.get(i)
        return (
          <Fragment key={i}>
            {precedingBreak && (
              <InstrumentalBreak
                brk={precedingBreak}
                isActive={precedingBreak.key === activeBreakInfo?.breakKey}
                activeDotIdx={activeBreakInfo?.dotIdx ?? -1}
                onSeek={onWordClick}
                registerDotRef={registerDotRef}
                containerRef={(el) => {
                  const map = breakContainerRefs?.current
                  if (!map) return
                  if (el) map.set(precedingBreak.key, el)
                  else map.delete(precedingBreak.key)
                }}
              />
            )}
            <div
              ref={(el) => {
                if (lineRefs?.current) lineRefs.current[i] = el
              }}
              data-testid={`word-line-${i}`}
              data-active={activeIndicesSet.has(i) ? 'true' : 'false'}
              className={clsx(
                'drop-shadow-lg my-5 duration-500 w-fit m-auto max-w-[80%] text-balance',
                'transition-[transform] motion-reduce:transition-none',
                activeIndicesSet.has(i) && !isBreakActive && 'scale-125',
              )}
            >
              {line.cueLines.length === 0 ? (
                <p lang={resolvedLang}>{line.value}</p>
              ) : (
                line.cueLines.map((cueLine) => {
                  const activeCueIdxForThisCueLine =
                    activeCueByKey[cueLine.key] ?? -1
                  const lastVisitedCueIdxForThisCueLine =
                    lastVisitedCueByKey[cueLine.key] ?? -1
                  return (
                    <p
                      key={cueLine.key}
                      lang={resolvedLang}
                      dir="auto"
                      role="text"
                      data-testid={`word-line-${i}-cueline-${cueLine.key}`}
                      data-agent-role={cueLine.agentRole ?? 'unknown'}
                      data-display-order={cueLine.displayOrder}
                    >
                      {/* NOTE: screen-reader fragmentation is a known limitation; role="text" on p partially mitigates it */}
                      {cueLine.cues.map((cue, cueIdx) => {
                        const renderedText = byteSliceFallback(
                          cue,
                          cueLine.value,
                        )
                        const isWhitespaceOnly =
                          renderedText.trim().length === 0

                        let cueState: 'past' | 'active' | 'future'
                        if (activeIndicesSet.has(i)) {
                          if (cueIdx === activeCueIdxForThisCueLine) {
                            cueState = 'active'
                          } else if (
                            cueIdx <= lastVisitedCueIdxForThisCueLine
                          ) {
                            cueState = 'past'
                          } else {
                            cueState = 'future'
                          }
                        } else if (i <= activeLineIdx) {
                          // `<=`, not `<`: catches the rightmost-started line when it has ended while an earlier concurrent line keeps going (i === activeLineIdx AND not in active set).
                          cueState = 'past'
                        } else {
                          cueState = 'future'
                        }

                        const hueClass =
                          cueState === 'active' && cueLine.displayOrder >= 1
                            ? HUE_ROTATE_CLASSES[
                                (cueLine.displayOrder - 1) %
                                  HUE_ROTATE_CLASSES.length
                              ]
                            : undefined
                        const isDim =
                          cueState === 'past' ||
                          (cueState === 'future' && i > activeLineIdx)
                        const cueClassName = clsx(
                          !isWhitespaceOnly &&
                            'cursor-pointer hover:opacity-100 [word-break:keep-all]',
                          isDim && 'opacity-50',
                          cueState === 'active' && 'font-semibold',
                          cueState === 'active' &&
                            !isWhitespaceOnly &&
                            'karaoke-fill',
                          hueClass,
                        )
                        const wordKey = `${i}|${cueLine.key}|${cueIdx}`

                        return (
                          <span
                            key={cueIdx}
                            ref={(el) => registerWordRef?.(wordKey, el)}
                            data-testid={`word-${i}-${cueLine.key}-${cueIdx}`}
                            data-state={cueState}
                            aria-hidden={isWhitespaceOnly ? 'true' : undefined}
                            className={cueClassName}
                            onClick={(e) => {
                              e.stopPropagation()
                              onWordClick(cue.start)
                            }}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter' || e.key === ' ') {
                                e.preventDefault()
                                onWordClick(cue.start)
                              }
                            }}
                            tabIndex={isWhitespaceOnly ? -1 : 0}
                          >
                            {renderedText}
                          </span>
                        )
                      })}
                    </p>
                  )
                })
              )}
            </div>
          </Fragment>
        )
      })}
      {/* Bottom spacer mirrors react-lrc's verticalSpace=true — lets the last line scroll to center */}
      <div aria-hidden="true" style={{ height: '50%' }} />
    </div>
  )
}

function InstrumentalBreak({
  brk,
  isActive,
  activeDotIdx,
  onSeek,
  registerDotRef,
  containerRef,
}: {
  brk: NormalizedBreak
  isActive: boolean
  activeDotIdx: number
  onSeek: (timeMs: number) => void
  registerDotRef?: (key: string, el: HTMLSpanElement | null) => void
  containerRef?: (el: HTMLDivElement | null) => void
}) {
  const durationPerDot = (brk.end - brk.start) / brk.dotCount
  return (
    <div
      ref={containerRef}
      data-testid={`instrumental-break-${brk.key}`}
      data-active={isActive ? 'true' : 'false'}
      className={clsx(
        'drop-shadow-lg my-5 duration-500 w-fit m-auto',
        'transition-[transform] motion-reduce:transition-none',
        isActive && 'scale-125',
      )}
    >
      <p className="flex flex-wrap items-center justify-center text-2xl 2xl:text-3xl font-semibold leading-none">
        {Array.from({ length: brk.dotCount }, (_, idx) => {
          const dotKey = `${brk.key}|${idx}`
          const dotStartMs = brk.start + idx * durationPerDot
          const isActiveDot = isActive && idx === activeDotIdx
          // Breaks <=5 dots: all spaced. Breaks >5 dots: only the LAST 5 dots
          // get spacing (pack the silence as a dense block, space the final
          // countdown). idx>0 guards the first dot from a leading margin.
          const isInSpacedZone = brk.dotCount <= 5 || idx >= brk.dotCount - 5
          return (
            <span
              key={idx}
              ref={(el) => registerDotRef?.(dotKey, el)}
              data-testid={`instrumental-break-${brk.key}-dot-${idx}`}
              data-state={isActiveDot ? 'active' : 'inactive'}
              role="button"
              aria-label={`Seek to ${Math.round(dotStartMs / 1000)} seconds`}
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation()
                onSeek(dotStartMs)
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault()
                  onSeek(dotStartMs)
                }
              }}
              className={clsx(
                'cursor-pointer hover:opacity-100',
                isInSpacedZone && idx > 0 && 'ml-3',
                !isActiveDot && 'opacity-50',
                isActiveDot && 'karaoke-fill',
              )}
            >
              ·
            </span>
          )
        })}
      </p>
    </div>
  )
}
