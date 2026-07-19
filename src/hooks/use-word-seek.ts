import { useCallback } from 'react'
import { usePlayerRef } from '@/store/player.store'

/**
 * Returns a stable callback that seeks audio playback to a word's start time.
 * `cueStartMs` must already have the structuredLyric offset baked in (done by wordTiming normalizer).
 */
export function useWordSeek(): (cueStartMs: number) => void {
  const playerRef = usePlayerRef()

  return useCallback(
    (cueStartMs: number) => {
      if (!playerRef || cueStartMs < 0) return
      const seconds = cueStartMs / 1000
      playerRef.currentTime = Math.max(
        0,
        Math.min(seconds, playerRef.duration || Infinity),
      )
    },
    [playerRef],
  )
}
