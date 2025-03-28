import { clsx } from 'clsx'
import {
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
} from 'lucide-react'
import { Fragment } from 'react/jsx-runtime'
import RepeatOne from '@/app/components/icons/repeat-one'
import { Button } from '@/app/components/ui/button'
import {
  usePlayerActions,
  usePlayerIsPlaying,
  usePlayerLoop,
  usePlayerShuffle,
  usePlayerPrevAndNext,
} from '@/store/player.store'
import { LoopState } from '@/types/playerContext'

export function FullscreenControls() {
  const isPlaying = usePlayerIsPlaying()
  const isShuffleActive = usePlayerShuffle()
  const loopState = usePlayerLoop()
  const { hasPrev, hasNext } = usePlayerPrevAndNext()
  const {
    isPlayingOneSong,
    toggleShuffle,
    playNextSong,
    playPrevSong,
    togglePlayPause,
    toggleLoop,
  } = usePlayerActions()

  return (
    <Fragment>
      <Button
        size="icon"
        variant="ghost"
        data-state={isShuffleActive && 'active'}
        className={clsx(
          buttonsStyle.secondary,
          isShuffleActive && buttonsStyle.activeDot,
        )}
        style={{ ...buttonsStyle.style }}
        onClick={() => toggleShuffle()}
        disabled={isPlayingOneSong() || !hasNext}
      >
        <Shuffle className={buttonsStyle.secondaryIcon} />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className={buttonsStyle.secondary}
        style={{ ...buttonsStyle.style }}
        onClick={() => playPrevSong()}
        disabled={!hasPrev}
      >
        <SkipBack className={buttonsStyle.secondaryIconFilled} />
      </Button>
      <Button
        size="icon"
        variant="link"
        className={buttonsStyle.main}
        style={{ ...buttonsStyle.style }}
        onClick={() => togglePlayPause()}
      >
        {isPlaying ? (
          <Pause className={buttonsStyle.mainIcon} strokeWidth={1} />
        ) : (
          <Play className={buttonsStyle.mainIcon} />
        )}
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className={buttonsStyle.secondary}
        style={{ ...buttonsStyle.style }}
        onClick={() => playNextSong()}
        disabled={!hasNext && loopState !== LoopState.All}
      >
        <SkipForward className={buttonsStyle.secondaryIconFilled} />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        data-state={loopState !== LoopState.Off && 'active'}
        className={clsx(
          buttonsStyle.secondary,
          loopState !== LoopState.Off && buttonsStyle.activeDot,
        )}
        onClick={() => toggleLoop()}
        style={{ ...buttonsStyle.style }}
      >
        {loopState === LoopState.Off && (
          <Repeat className={buttonsStyle.secondaryIcon} />
        )}
        {loopState === LoopState.All && (
          <Repeat className={buttonsStyle.secondaryIcon} />
        )}
        {loopState === LoopState.One && (
          <RepeatOne className={buttonsStyle.secondaryIcon} />
        )}
      </Button>
    </Fragment>
  )
}

export const buttonsStyle = {
  main: 'w-14 h-14 rounded-full shadow-lg bg-secondary-foreground hover:scale-105 transition-transform will-change-transform',
  mainIcon: 'w-6 h-6 text-secondary fill-secondary',
  secondary:
    'relative w-12 h-12 rounded-full text-secondary-foreground hover:text-secondary-foreground data-[state=active]:text-primary hover:bg-transparent hover:scale-110 transition-transform will-change-transform',
  secondaryIcon: 'w-6 h-6 drop-shadow-lg',
  secondaryIconFilled:
    'w-6 h-6 text-secondary-foreground fill-secondary-foreground drop-shadow-lg',
  activeDot: 'player-button-active',
  style: {
    backfaceVisibility: 'hidden' as const,
  },
}
