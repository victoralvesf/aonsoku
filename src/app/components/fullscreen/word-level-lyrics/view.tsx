import clsx from 'clsx'
import { isSafari } from 'react-device-detect'
import { byteSliceFallback } from '@/utils/byteSlice'
import type { NormalizedStructuredLyric } from '@/utils/wordTiming'

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
  /** -1 when no line is active. */
  activeLineIdx: number
  /** Map from NormalizedCueLine.key → active cue index. Empty Record when no line active. */
  activeCueByKey: Readonly<Record<string, number>>
  /**
   * Map from NormalizedCueLine.key → greatest cue index whose start time has
   * passed. Stays populated during inter-cue gaps and between-line transitions
   * so previously-visited words keep their `opacity-50` past styling instead
   * of snapping back to the future state.
   */
  lastVisitedCueByKey: Readonly<Record<string, number>>
  /** Called with the cue's normalised (offset-applied) start time in ms. */
  onWordClick: (cueStartMs: number) => void
  /** Result of resolveLyricsLang(data.lang, langCode) — computed by the container. */
  resolvedLang: string | undefined
  /** Forwarded to the outer scroll container so the container can attach a ref. */
  scrollContainerRef?: React.Ref<HTMLDivElement>
  /** Refs for each LINE CONTAINER <div> by line index — for scroll-into-view. */
  lineRefs?: React.MutableRefObject<(HTMLDivElement | null)[]>
}

export function WordLevelLyricsView({
  data,
  activeLineIdx,
  activeCueByKey,
  lastVisitedCueByKey,
  onWordClick,
  resolvedLang,
  scrollContainerRef,
  lineRefs,
}: WordLevelLyricsViewProps) {
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
      {data.lines.map((line, i) => (
        <div
          ref={(el) => {
            if (lineRefs?.current) lineRefs.current[i] = el
          }}
          key={i}
          data-testid={`word-line-${i}`}
          data-active={i === activeLineIdx ? 'true' : 'false'}
          className={clsx(
            'drop-shadow-lg my-5 duration-500 w-fit m-auto max-w-[80%] text-balance',
            'transition-[transform] motion-reduce:transition-none',
            i === activeLineIdx && 'scale-125',
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
                  {cueLine.cues.map((cue, cueIdx) => {
                    const renderedText = byteSliceFallback(cue, cueLine.value)
                    const isWhitespaceOnly = renderedText.trim().length === 0

                    let cueState: 'past' | 'active' | 'future'
                    if (i < activeLineIdx) {
                      cueState = 'past'
                    } else if (i === activeLineIdx) {
                      if (cueIdx === activeCueIdxForThisCueLine) {
                        cueState = 'active'
                      } else if (cueIdx <= lastVisitedCueIdxForThisCueLine) {
                        cueState = 'past'
                      } else {
                        cueState = 'future'
                      }
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
                      cueState === 'active' && 'text-primary font-semibold',
                      hueClass,
                    )

                    return (
                      <span
                        key={cueIdx}
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
      ))}
      {/* Bottom spacer mirrors react-lrc's verticalSpace=true — lets the last line scroll to center */}
      <div aria-hidden="true" style={{ height: '50%' }} />
    </div>
  )
}
