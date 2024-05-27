import { CellContext } from "@tanstack/react-table"
import { PauseIcon, PlayIcon } from 'lucide-react'

import { usePlayer } from "@/app/contexts/player-context"
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'
import { Button } from "@/app/components/ui/button"
import { ISong } from "@/types/responses/song"
import Image from "@/app/components/image"

interface PlaySongButtonProps {
  cell: CellContext<ISong, unknown>
}

export default function PlaySongButton({ cell }: PlaySongButtonProps) {
  const trackNumber = cell.row.index + 1
  const song = cell.row.original

  const player = usePlayer()

  return (
    <div className="text-center text-foreground flex justify-center">
      {(player.checkActiveSong(song.id) && !player.isPlaying) && (
        <div className="w-8 flex items-center">
          <SimpleTooltip text={`Pause ${song.title} by ${song.artist}`}>
            <Button
              className="w-8 h-8 rounded-full group hover:bg-white dark:hover:bg-slate-950 hover:shadow-sm"
              size="icon"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                player.togglePlayPause()
              }}
            >
              <PlayIcon className="w-3 h-3 opacity-80 group-hover:opacity-100 fill-inherit dark:fill-slate-50" strokeWidth={4} />
            </Button>
          </SimpleTooltip>
        </div>
      )}
      {(player.checkActiveSong(song.id) && player.isPlaying) && (
        <>
          <div className="group-hover/tablerow:hidden w-8 flex items-center">
            <div className="w-8 h-8 overflow-hidden rounded-full">
              <Image src="/sound-motion.gif" className="ml-[3px] mt-[7px] dark:invert w-6 h-4" />
            </div>
          </div>
          <div className="hidden group-hover/tablerow:flex justify-center">
            <SimpleTooltip text={`Pause ${song.title} by ${song.artist}`}>
              <Button
                className="w-8 h-8 rounded-full group hover:bg-white dark:hover:bg-slate-950 hover:shadow-sm"
                size="icon"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation()
                  player.togglePlayPause()
                }}
              >
                <PauseIcon className="w-4 h-4 opacity-80 group-hover:opacity-100 fill-inherit dark:fill-slate-50" strokeWidth={1} />
              </Button>
            </SimpleTooltip>
          </div>
        </>
      )}
      {!player.checkActiveSong(song.id) && (
        <>
          <div className="group-hover/tablerow:hidden w-8">
            {trackNumber}
          </div>
          <div className="hidden group-hover/tablerow:flex justify-center">
            <SimpleTooltip text={`Play ${song.title} by ${song.artist}`}>
              <Button
                className="w-8 h-8 rounded-full group hover:bg-white dark:hover:bg-slate-950 hover:shadow-sm"
                size="icon"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation()
                  cell.table.options.meta?.handlePlaySong?.(cell.row)
                }}
              >
                <PlayIcon className="w-3 h-3 opacity-80 group-hover:opacity-100 fill-inherit dark:fill-slate-50" strokeWidth={4} />
              </Button>
            </SimpleTooltip>
          </div>
        </>
      )}
    </div>
  )
}