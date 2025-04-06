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
  usePlayerPrevAndNext,
  usePlayerShuffle,
  usePlayerSongStarred,
} from '@/store/player.store'
import { LoopState } from '@/types/playerContext'

export function MiniPlayerControls() {
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
    <div className="flex items-center">
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
        <Shuffle size={18} />
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
        <SkipBack className={buttonsStyle.secondaryIconFilled} width={20} />
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
          <Pause
            className={buttonsStyle.mainIcon}
            size={20}
            strokeWidth={0.75}
            strokeLinecap="square"
            strokeLinejoin="round"
          />
        ) : (
          <Play className={buttonsStyle.mainIcon} size={18} strokeWidth={1} />
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
        <SkipForward className={buttonsStyle.secondaryIconFilled} size={20} />
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
        {loopState === LoopState.Off && <Repeat size={18} />}
        {loopState === LoopState.All && <Repeat size={18} />}
        {loopState === LoopState.One && <RepeatOne size={18} />}
      </Button>
    </div>
  )
}

export function MiniPlayerLikeButton() {
  const isSongStarred = usePlayerSongStarred()
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
        className={clsx(isSongStarred && 'text-red-500 fill-red-500')}
        size={18}
      />
    </Button>
  )
}

const buttonsStyle = {
  main: 'w-9 h-9 p-0 rounded-full bg-secondary-foreground hover:scale-105 transition-transform will-change-transform',
  mainIcon: 'text-secondary fill-secondary',
  secondary:
    'relative w-9 h-9 p-0 rounded-full text-secondary-foreground hover:text-secondary-foreground data-[state=active]:text-primary hover:bg-transparent hover:scale-110 transition-transform will-change-transform',
  secondaryIconFilled: 'text-secondary-foreground fill-secondary-foreground',
  activeDot: 'mini-player-button-active',
  style: {
    backfaceVisibility: 'hidden' as const,
  },
  removeRing:
    'focus-visible:ring-0 focus-visible:ring-transparent ring-0 ring-offset-transparent',
}
