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
} from '@/store/player.store'
import { LoopState } from '@/types/playerContext'

export function FullscreenControls() {
  const isPlaying = usePlayerIsPlaying()
  const isShuffleActive = usePlayerShuffle()
  const loopState = usePlayerLoop()
  const {
    isPlayingOneSong,
    toggleShuffle,
    playNextSong,
    playPrevSong,
    hasNextSong,
    hasPrevSong,
    togglePlayPause,
    toggleLoop,
  } = usePlayerActions()

  return (
    <Fragment>
      <Button
        size="icon"
        variant="ghost"
        className={clsx(
          buttonsStyle.secondary,
          isShuffleActive && buttonsStyle.activeDot,
        )}
        onClick={() => toggleShuffle()}
        disabled={isPlayingOneSong() || !hasNextSong()}
      >
        <Shuffle
          className={clsx(
            buttonsStyle.secondaryIcon,
            isShuffleActive && 'text-primary',
          )}
        />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className={buttonsStyle.secondary}
        onClick={() => playPrevSong()}
        disabled={!hasPrevSong()}
      >
        <SkipBack className={buttonsStyle.secondaryIconFilled} />
      </Button>
      <Button
        size="icon"
        variant="link"
        className={buttonsStyle.main}
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
        onClick={() => playNextSong()}
        disabled={!hasNextSong() && loopState !== LoopState.All}
      >
        <SkipForward className={buttonsStyle.secondaryIconFilled} />
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className={clsx(
          buttonsStyle.secondary,
          loopState !== LoopState.Off && buttonsStyle.activeDot,
        )}
        onClick={() => toggleLoop()}
      >
        {loopState === LoopState.Off && (
          <Repeat className={clsx(buttonsStyle.secondaryIcon)} />
        )}
        {loopState === LoopState.All && (
          <Repeat
            className={clsx(buttonsStyle.secondaryIcon, 'text-primary')}
          />
        )}
        {loopState === LoopState.One && (
          <RepeatOne
            className={clsx(buttonsStyle.secondaryIcon, 'text-primary')}
          />
        )}
      </Button>
    </Fragment>
  )
}

export const buttonsStyle = {
  main: 'w-14 h-14 rounded-full shadow-lg bg-secondary-foreground hover:scale-105 transition-transform transform-gpu',
  mainIcon: 'w-6 h-6 text-background fill-background transform-gpu',
  secondary:
    'relative w-12 h-12 rounded-full hover:bg-transparent hover:scale-110 transition-transform transform-gpu',
  secondaryIcon: 'w-6 h-6 drop-shadow-lg transform-gpu',
  secondaryIconFilled:
    'w-6 h-6 fill-secondary-foreground drop-shadow-lg transform-gpu',
  activeDot: 'player-button-active',
}
