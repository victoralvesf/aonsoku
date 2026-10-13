import { useEffect, useRef } from 'react'
import { usePlayerIsPlaying } from '@/store/player.store'
import { logger } from '@/utils/logger'
import { getSilentAudioUrl } from '@/utils/silentAudio'

/**
 * Media Session anchor for the gapless engine.
 *
 * The gapless player outputs audio through Web Audio (decoded buffers) and
 * pauses the streaming <audio> element during buffer playback. Browsers only
 * surface the OS media session (controls, media keys, notification) while an
 * audible media element is actively playing, so pure Web Audio output leaves
 * the page with no session. This hidden element loops a silent clip while
 * playback is active, purely to keep that session alive; the metadata, action
 * handlers, and position are still driven by MediaSessionObserver and the
 * gapless loop's setPositionState.
 *
 * It is deliberately kept out of the Web Audio graph and plays its own (silent)
 * output, so it never touches the audible signal path and never competes with
 * track decoding for bandwidth, so it cannot introduce clicks at the album seam.
 *
 * The standard player, radio and podcasts play through a real <audio> element that
 * anchors the session on its own.
 */
export function MediaSessionKeepAlive() {
  const ref = useRef<HTMLAudioElement>(null)
  const isPlaying = usePlayerIsPlaying()

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (isPlaying) {
      // Post-gesture (the play press), so autoplay policy allows this.
      el.play().catch((err) => {
        // AbortError = superseded by a pause() during rapid toggles; not real.
        if (err?.name !== 'AbortError') {
          logger.error('[media-session] keep-alive play() failed', err)
        }
      })
    } else {
      el.pause()
    }
  }, [isPlaying])

  // Stop on unmount (e.g., switching gapless off mid-playback).
  useEffect(() => {
    const el = ref.current
    return () => el?.pause()
  }, [])

  return (
    <audio
      ref={ref}
      src={getSilentAudioUrl()}
      loop
      preload="auto"
      // Must not be muted: a muted element won't anchor the media session.
      aria-hidden="true"
      data-testid="media-session-keep-alive"
    />
  )
}
