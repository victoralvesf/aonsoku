import {
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
} from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { usePlayer } from '@/app/contexts/player-context'
import { cn } from '@/lib/utils'
import { convertSecondsToTime } from '@/utils/convertSecondsToTime'
import { Slider } from '@/app/components/ui/slider'
import { VolumePopover } from './volume-popover'
import { LikeButton } from './like-button'

export function FullscreenPlayer() {
  const player = usePlayer()

  return (
    <div className="w-full relative border bg-background/70 overflow-hidden rounded-2xl shadow-lg shadows-4 shadow-opacity-5 shadow-y-[3px] shadows-scale-3">
      <Slider
        defaultValue={[0]}
        value={[player.progress]}
        max={player.currentDuration}
        step={1}
        className="w-full z-20 absolute top-[0.25px]"
        showThumb={false}
      />
      <div className="relative flex items-center gap-4 p-4 2xl:p-6">
        <div className="w-[200px] text-secondary-foreground/80 font-medium flex gap-1">
          <div className="w-[45px]">
            {convertSecondsToTime(player.progress)}
          </div>
          <div>{'/'}</div>
          <div className="w-[45px]">
            {convertSecondsToTime(player.currentDuration ?? 0)}
          </div>
        </div>

        <div className="flex flex-1 justify-center items-center gap-2">
          <Button
            size="icon"
            variant={player.isShuffleActive ? 'outline' : 'ghost'}
            className="w-12 h-12 p-2 rounded-full"
            onClick={() => player.toggleShuffle()}
            disabled={player.isPlayingOneSong}
          >
            <Shuffle
              className={cn(
                'w-5 h-5',
                player.isShuffleActive && 'text-primary',
              )}
            />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="w-12 h-12 p-2 rounded-full"
            onClick={() => player.playPrevSong()}
            disabled={!player.hasPrevSong}
          >
            <SkipBack className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            variant="default"
            className="w-14 h-14 rounded-full shadow-md"
            onClick={() => player.togglePlayPause()}
          >
            {player.isPlaying ? (
              <Pause
                className="w-6 h-6 fill-background dark:text-secondary-foreground dark:fill-secondary-foreground"
                strokeWidth={1}
              />
            ) : (
              <Play className="w-6 h-6 fill-background dark:text-secondary-foreground dark:fill-secondary-foreground" />
            )}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="w-12 h-12 p-2 rounded-full"
            onClick={() => player.playNextSong()}
            disabled={!player.hasNextSong}
          >
            <SkipForward className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            variant={player.isLoopActive ? 'outline' : 'ghost'}
            className="w-12 h-12 p-2 rounded-full"
            onClick={() => player.toggleLoop()}
          >
            <Repeat
              className={cn('w-5 h-5', player.isLoopActive && 'text-primary')}
            />
          </Button>
        </div>

        <div className="w-[200px] flex items-center justify-end gap-2">
          <LikeButton />
          <VolumePopover />
        </div>
      </div>
    </div>
  )
}
