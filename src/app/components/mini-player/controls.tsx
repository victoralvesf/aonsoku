import { clsx } from 'clsx'
import {
  Heart,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
} from 'lucide-react'
import RepeatOne from '@/app/components/icons/repeat-one'
import { Button } from '@/app/components/ui/button'
import { cn } from '@/lib/utils'
import {
  usePlayerActions,
  usePlayerIsPlaying,
  usePlayerLoop,
  usePlayerShuffle,
  usePlayerState,
} from '@/store/player.store'
import { LoopState } from '@/types/playerContext'

export function MiniPlayerControls() {
  const isPlaying = usePlayerIsPlaying()
  const isShuffleActive = usePlayerShuffle()
  const loopState = usePlayerLoop()
  const { hasPrev, hasNext } = usePlayerState()
  const {
    isPlayingOneSong,
    toggleShuffle,
    playNextSong,
    playPrevSong,
    togglePlayPause,
    toggleLoop,
  } = usePlayerActions()

  return (
    <div>
      <Button
        size="icon"
        variant="ghost"
        data-state={isShuffleActive && 'active'}
        className={clsx(
          buttonsStyle.secondary,
          buttonsStyle.removeRing,
          isShuffleActive && buttonsStyle.activeDot,
          'mini-player:hidden',
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
        className={clsx(
          buttonsStyle.secondary,
          buttonsStyle.removeRing,
          'mini-player:hidden',
        )}
        style={{ ...buttonsStyle.style }}
        onClick={() => playPrevSong()}
        disabled={!hasPrev}
      >
        <SkipBack className={buttonsStyle.secondaryIconFilled} />
      </Button>
      <Button
        size="icon"
        variant="link"
        className={cn(
          buttonsStyle.main,
          buttonsStyle.removeRing,
          'mini-player:w-8 mini-player:h-8',
        )}
        style={{ ...buttonsStyle.style }}
        onClick={() => togglePlayPause()}
      >
        {isPlaying ? (
          <Pause className={buttonsStyle.mainIcon} />
        ) : (
          <Play className={buttonsStyle.mainIcon} />
        )}
      </Button>
      <Button
        size="icon"
        variant="ghost"
        className={clsx(
          buttonsStyle.secondary,
          buttonsStyle.removeRing,
          'mini-player:w-8 mini-player:h-8',
        )}
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
          buttonsStyle.removeRing,
          loopState !== LoopState.Off && buttonsStyle.activeDot,
          'mini-player:hidden',
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
    </div>
  )
}

export function MiniPlayerLikeButton() {
  const { isSongStarred } = usePlayerState()
  const { starCurrentSong } = usePlayerActions()

  return (
    <Button
      size="icon"
      variant="ghost"
      className={clsx(
        buttonsStyle.secondary,
        buttonsStyle.removeRing,
        'mini-player:hidden',
      )}
      onClick={starCurrentSong}
      style={{ ...buttonsStyle.style }}
    >
      <Heart
        className={clsx(
          'w-[18px] h-[18px] drop-shadow-lg',
          isSongStarred && 'text-red-500 fill-red-500',
        )}
      />
    </Button>
  )
}

const buttonsStyle = {
  main: 'w-10 h-10 rounded-full shadow-lg bg-secondary-foreground hover:scale-105 transition-transform will-change-transform',
  mainIcon: 'w-5 h-5 text-secondary fill-secondary',
  secondary:
    'relative w-10 h-10 rounded-full text-secondary-foreground hover:text-secondary-foreground data-[state=active]:text-primary hover:bg-transparent hover:scale-110 transition-transform will-change-transform',
  secondaryIcon: 'w-5 h-5 drop-shadow-lg',
  secondaryIconFilled:
    'w-5 h-5 text-secondary-foreground fill-secondary-foreground drop-shadow-lg',
  activeDot: 'player-button-active',
  style: {
    backfaceVisibility: 'hidden' as const,
  },
  removeRing:
    'focus-visible:ring-0 focus-visible:ring-transparent ring-0 ring-offset-transparent',
}
