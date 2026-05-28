import { useCallback, useEffect, useMemo, useRef } from 'react'
import { isSafari } from 'react-device-detect'
import { useRafActiveCue } from '@/hooks/use-raf-active-cue'
import { useWordSeek } from '@/hooks/use-word-seek'
import { useLang } from '@/store/lang.store'
import { usePlayerRef } from '@/store/player.store'
import type { IStructuredLyric } from '@/types/responses/song'
import { normalizeStructuredLyric } from '@/utils/wordTiming'
import { resolveLyricsLang } from '../lyrics'
import { WordLevelLyricsView } from './view'

const SCROLL_RECOVERY_MS = 1500

export interface WordLevelLyricsContainerProps {
  structuredLyric: IStructuredLyric
  /** When false, disables rAF polling (e.g. component not visible). Defaults to true. */
  enabled?: boolean
}

export function WordLevelLyricsContainer({
  structuredLyric,
  enabled = true,
}: WordLevelLyricsContainerProps) {
  // Normalise once; re-normalise only when the raw data reference changes.
  const normalized = useMemo(
    () => normalizeStructuredLyric(structuredLyric),
    [structuredLyric],
  )

  const { langCode } = useLang()
  const resolvedLang = useMemo(
    () => resolveLyricsLang(normalized.lang, langCode),
    [normalized.lang, langCode],
  )

  // Audio time getter — passed to the rAF hook so the hook stays store-agnostic.
  const playerRef = usePlayerRef()
  const getCurrentTimeMs = useCallback(
    () => (playerRef?.currentTime ?? 0) * 1000,
    [playerRef],
  )

  const { activeLineIdx, activeCueByKey, lastVisitedCueByKey } =
    useRafActiveCue({
      lines: normalized.lines,
      getCurrentTimeMs,
      enabled: enabled && normalized.hasWordTiming,
    })

  const onWordClick = useWordSeek()

  // Refs for DOM nodes.
  const scrollContainerRef = useRef<HTMLDivElement>(null)
  const lineRefs = useRef<(HTMLDivElement | null)[]>([])

  // Auto-scroll with recovery — mirrors react-lrc's recoverAutoScrollInterval={1500}.
  const userScrollGuardRef = useRef({ pausedUntilMs: 0 })
  const programmaticScrollRef = useRef(false)

  // Attach scroll listener to detect user-initiated scrolls.
  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el) return
    const onScroll = () => {
      // Ignore scroll events caused by our own programmatic scrollIntoView.
      if (programmaticScrollRef.current) return
      userScrollGuardRef.current.pausedUntilMs =
        performance.now() + SCROLL_RECOVERY_MS
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  // Scroll active line into view when it changes. Fires once per activeLineIdx
  // change — never per rAF tick — because the effect depends on activeLineIdx.
  useEffect(() => {
    if (activeLineIdx < 0) return
    if (performance.now() < userScrollGuardRef.current.pausedUntilMs) return

    const lineEl = lineRefs.current[activeLineIdx]
    const scrollEl = scrollContainerRef.current
    if (!lineEl || !scrollEl) return

    programmaticScrollRef.current = true
    lineEl.scrollIntoView({
      behavior: isSafari ? 'auto' : 'smooth',
      block: 'center',
    })

    // A smooth scroll fires many `scroll` events asynchronously over ~300-500ms.
    // We must keep `programmaticScrollRef.current` true until the scroll really
    // finishes, otherwise the scroll-listener mistakes those events for a user
    // scroll and pauses auto-scroll for SCROLL_RECOVERY_MS — causing the next
    // line transition to be silently skipped.
    const clearFlag = () => {
      programmaticScrollRef.current = false
    }

    // Prefer the native `scrollend` event when available
    // Otherwise fall back to a timeout long enough to
    // cover typical smooth-scroll durations across browsers.
    if ('onscrollend' in scrollEl) {
      scrollEl.addEventListener('scrollend', clearFlag, { once: true })
      return () => {
        scrollEl.removeEventListener('scrollend', clearFlag)
      }
    }
    const handle = setTimeout(clearFlag, 700)
    return () => clearTimeout(handle)
  }, [activeLineIdx])

  // Defensive: should never be mounted without word timing, but bail out safely.
  if (!normalized.hasWordTiming) return null

  return (
    <WordLevelLyricsView
      data={normalized}
      activeLineIdx={activeLineIdx}
      activeCueByKey={activeCueByKey}
      lastVisitedCueByKey={lastVisitedCueByKey}
      onWordClick={onWordClick}
      resolvedLang={resolvedLang}
      scrollContainerRef={scrollContainerRef}
      lineRefs={lineRefs}
    />
  )
}
