import { LoopState, TransitionMode } from '@/types/playerContext'
import { ISong } from '@/types/responses/song'

export interface TransitionSettings {
  transitionMode: TransitionMode
  isShuffleActive: boolean
}

export interface ResolvedTransition {
  kind: 'none' | 'gapless'
  fadeMs: number
}

// Pure hard cut by default (0): the pre-warmed standby starts at sample 0 the
// instant the active lane ends; no fade-in (which would attenuate the seam)
// and no start-lead (which would clip the tail). Bump to a few ms only as a
// fallback if a specific seam is found to click.
export const GAPLESS_GUARD_FADE_MS = 0

/**
 * Gapless is album-scoped: only join two tracks seamlessly when they are
 * consecutive tracks of the same album (same album + disc, next track number).
 */
export function isSameAlbumConsecutive(from: ISong, to: ISong): boolean {
  return (
    from.albumId === to.albumId &&
    from.discNumber === to.discNumber &&
    to.track === from.track + 1
  )
}

export function resolveTransition(
  from: ISong | null,
  to: ISong | null,
  settings: TransitionSettings,
): ResolvedTransition {
  const gapless =
    from !== null &&
    to !== null &&
    settings.transitionMode === 'gapless' &&
    !settings.isShuffleActive &&
    isSameAlbumConsecutive(from, to)

  if (gapless) {
    return { kind: 'gapless', fadeMs: GAPLESS_GUARD_FADE_MS }
  }

  return { kind: 'none', fadeMs: 0 }
}

export interface StandbySettings {
  loopState: LoopState
  transitionMode: TransitionMode
  isShuffleActive: boolean
}

// The track that would play next from the current queue position, honoring the
// loop mode: loop-one never advances (null), loop-all wraps past the end back to
// index 0, otherwise it's the following track or null at the end of the queue.
export function selectNextSong(
  list: ISong[],
  index: number,
  loopState: LoopState,
): ISong | null {
  if (loopState === LoopState.One) return null

  const nextIndex = index + 1
  if (nextIndex < list.length) return list[nextIndex]
  if (loopState === LoopState.All && list.length > 0) return list[0]

  return null
}

// The next track ONLY when it should join the current one gaplessly (gapless
// mode on, not shuffled, album-consecutive); null otherwise. Single source of
// truth for "is there a standby track to pre-warm for a seam"; composes the
// loop-aware next-track pick with the transition rule so the two can't drift.
export function selectStandbySong(
  list: ISong[],
  index: number,
  { loopState, transitionMode, isShuffleActive }: StandbySettings,
): ISong | null {
  const current = list[index] ?? null
  const next = selectNextSong(list, index, loopState)
  const { kind } = resolveTransition(current, next, {
    transitionMode,
    isShuffleActive,
  })

  return kind === 'gapless' ? next : null
}
