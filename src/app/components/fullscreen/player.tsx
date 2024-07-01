import { clsx } from 'clsx'
import {
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
} from 'lucide-react'
import { useCallback, useState } from 'react'
import { Button } from '@/app/components/ui/button'
import { Slider } from '@/app/components/ui/slider'
import { usePlayer } from '@/app/contexts/player-context'
import { convertSecondsToTime } from '@/utils/convertSecondsToTime'
import { LikeButton } from './like-button'
import { VolumeContainer } from './volume-container'

let isSeeking = false

export function FullscreenPlayer() {
  const [progress, setProgress] = useState(0)
  const player = usePlayer()

  const handleSeeking = useCallback((amount: number) => {
    isSeeking = true
    setProgress(amount)
  }, [])

  const handleSeeked = useCallback(
    (amount: number) => {
      isSeeking = false

      if (player.audioPlayerRef && player.audioPlayerRef.current) {
        player.audioPlayerRef.current.currentTime = amount
        setProgress(amount)
        player.setProgress(amount)
      }
    },
    [player],
  )

  return (
    <div className="w-full">
      <div className="flex gap-4 items-center">
        <div className="min-w-[50px] text-right">
          {convertSecondsToTime(player.progress)}
        </div>

        <Slider
          variant="secondary"
          defaultValue={[progress]}
          value={isSeeking ? [progress] : [player.progress]}
          max={player.currentDuration}
          step={1}
          className="w-full h-4"
          onValueChange={([value]) => handleSeeking(value)}
          onValueCommit={([value]) => handleSeeked(value)}
        />

        <div className="min-w-[50px] text-left">
          {convertSecondsToTime(player.currentDuration ?? 0)}
        </div>
      </div>
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
              player.isShuffleActive && buttonStyle.activeDot,
            )}
            onClick={() => player.toggleShuffle()}
            disabled={player.isPlayingOneSong}
          >
            <Shuffle
              className={clsx(
                buttonStyle.secondaryIcon,
                player.isShuffleActive && 'text-primary',
              )}
            />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className={buttonStyle.secondary}
            onClick={() => player.playPrevSong()}
            disabled={!player.hasPrevSong}
          >
            <SkipBack className={buttonStyle.secondaryIconFilled} />
          </Button>
          <Button
            size="icon"
            variant="link"
            className={buttonStyle.main}
            onClick={() => player.togglePlayPause()}
          >
            {player.isPlaying ? (
              <Pause className={buttonStyle.mainIcon} strokeWidth={1} />
            ) : (
              <Play className={buttonStyle.mainIcon} />
            )}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className={buttonStyle.secondary}
            onClick={() => player.playNextSong()}
            disabled={!player.hasNextSong}
          >
            <SkipForward className={buttonStyle.secondaryIconFilled} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className={clsx(
              buttonStyle.secondary,
              player.isLoopActive && buttonStyle.activeDot,
            )}
            onClick={() => player.toggleLoop()}
          >
            <Repeat
              className={clsx(
                buttonStyle.secondaryIcon,
                player.isLoopActive && 'text-primary',
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
