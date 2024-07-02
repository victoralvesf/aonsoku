import { clsx } from 'clsx'
import {
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
} from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import {
  usePlayerActions,
  usePlayerIsPlaying,
  usePlayerState,
} from '@/store/player.store'
import { LikeButton } from './like-button'
import { FullscreenProgress } from './progress'
import { VolumeContainer } from './volume-container'

export function FullscreenPlayer() {
  const isPlaying = usePlayerIsPlaying()
  const { isShuffleActive, isLoopActive } = usePlayerState()
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
    <div className="w-full">
      <FullscreenProgress />

      <div className="flex items-center justify-between gap-4 mt-5">
        <div className="w-[200px] flex justify-start">
          <LikeButton className={buttonStyle.secondary} />
        </div>

        <div className="flex flex-1 justify-center items-center gap-2">
          <Button
            size="icon"
            variant="ghost"
            className={clsx(
              buttonStyle.secondary,
              isShuffleActive && buttonStyle.activeDot,
            )}
            onClick={() => toggleShuffle()}
            disabled={isPlayingOneSong()}
          >
            <Shuffle
              className={clsx(
                buttonStyle.secondaryIcon,
                isShuffleActive && 'text-primary',
              )}
            />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className={buttonStyle.secondary}
            onClick={() => playPrevSong()}
            disabled={!hasPrevSong()}
          >
            <SkipBack className={buttonStyle.secondaryIconFilled} />
          </Button>
          <Button
            size="icon"
            variant="link"
            className={buttonStyle.main}
            onClick={() => togglePlayPause()}
          >
            {isPlaying ? (
              <Pause className={buttonStyle.mainIcon} strokeWidth={1} />
            ) : (
              <Play className={buttonStyle.mainIcon} />
            )}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className={buttonStyle.secondary}
            onClick={() => playNextSong()}
            disabled={!hasNextSong()}
          >
            <SkipForward className={buttonStyle.secondaryIconFilled} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className={clsx(
              buttonStyle.secondary,
              isLoopActive && buttonStyle.activeDot,
            )}
            onClick={() => toggleLoop()}
          >
            <Repeat
              className={clsx(
                buttonStyle.secondaryIcon,
                isLoopActive && 'text-primary',
              )}
            />
          </Button>
        </div>

        <div className="w-[200px] flex justify-end">
          <VolumeContainer className={buttonStyle.secondaryIcon} />
        </div>
      </div>
    </div>
  )
}

const buttonStyle = {
  main: 'w-14 h-14 rounded-full shadow-md bg-secondary-foreground hover:scale-105',
  mainIcon: 'w-6 h-6 text-background fill-background',
  secondary:
    'relative w-12 h-12 rounded-full hover:bg-transparent hover:scale-110',
  secondaryIcon: 'w-6 h-6',
  secondaryIconFilled: 'w-6 h-6 fill-secondary-foreground',
  activeDot: 'player-button-active',
}
