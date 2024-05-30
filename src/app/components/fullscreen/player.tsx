import { Pause, Play, Repeat, Shuffle, SkipBack, SkipForward } from "lucide-react";
import { Button } from "@/app/components/ui/button";
import { usePlayer } from "@/app/contexts/player-context";
import { cn } from "@/lib/utils";
import { convertSecondsToTime } from "@/utils/convertSecondsToTime";

export function FullscreenPlayer() {
  const player = usePlayer()

  const currentTimePercent = (player.progress / player.currentDuration) * 100

  return (
    <div className="w-full relative border bg-background/70 overflow-hidden rounded-2xl shadow-lg shadows-4 shadow-opacity-5 shadow-y-[3px] shadows-scale-3">
      <div
        className="absolute inset-0 rounded-sm"
        style={{
          backgroundColor: 'hsl(var(--primary))',
          width: `${currentTimePercent}%`,
          height: '4px',
          transition: 'width 1s linear'
        }}
      />
      <div className="relative flex items-center gap-4 p-4 2xl:p-6">
        <span className="text-secondary-foreground/80 font-medium w-[200px]">
          {convertSecondsToTime(player.progress)}
        </span>

        <div className="flex flex-1 justify-center items-center gap-2">
          <Button
            size="icon"
            variant={player.isShuffleActive ? "outline" : "ghost"}
            className="w-12 h-12 p-2 rounded-full"
            onClick={() => player.toggleShuffle()}
          >
            <Shuffle className={cn("w-5 h-5", player.isShuffleActive && "text-primary")} />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="w-12 h-12 p-2 rounded-full"
            onClick={() => player.playPrevSong()}
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
              <Pause className="w-6 h-6 fill-background dark:text-secondary-foreground dark:fill-secondary-foreground" strokeWidth={1} />
            ) : (
              <Play className="w-6 h-6 fill-background dark:text-secondary-foreground dark:fill-secondary-foreground" />
            )}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="w-12 h-12 p-2 rounded-full"
            onClick={() => player.playNextSong()}
          >
            <SkipForward className="w-5 h-5" />
          </Button>
          <Button
            size="icon"
            variant={player.isLoopActive ? "outline" : "ghost"}
            className="w-12 h-12 p-2 rounded-full"
            onClick={() => player.toggleLoop()}
          >
            <Repeat className={cn("w-5 h-5", player.isLoopActive && "text-primary")} />
          </Button>
        </div>

        <span className="text-secondary-foreground/80 font-medium w-[200px] text-right">
          {convertSecondsToTime(player.currentDuration ?? 0)}
        </span>
      </div>
    </div>
  )
}