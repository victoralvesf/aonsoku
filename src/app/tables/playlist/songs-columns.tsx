import { PauseIcon, PlayIcon } from 'lucide-react'
import { Badge } from "@/app/components/ui/badge"
import { ISong } from "@/types/responses/song"
import { CellContext, ColumnDef } from "@tanstack/react-table"
import { convertSecondsToTime } from '@/utils/convertSecondsToTime'
import { getCoverArtUrl } from "@/api/httpClient"
import Image from "@/app/components/image"
import { Button } from "@/app/components/ui/button"
import { Link } from 'react-router-dom'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'
import { usePlayer } from '@/app/contexts/player-context'
import clsx from 'clsx'

export const playlistSongsColumns: ColumnDef<ISong>[] = [
  {
    accessorKey: "index",
    header: () => {
      return <div className="text-center">#</div>
    },
    cell: (cell) => {
      return <PlaySongButton cell={cell} />
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const coverArt = row.original.coverArt
      const title = row.original.title

      const player = usePlayer()

      return (
        <div className="flex gap-2 items-center">
          <Image
            src={getCoverArtUrl(coverArt, '80')}
            alt={title}
            width={40}
            height={40}
            className="rounded shadow-md"
          />
          <p className={clsx(player.checkActiveSong(row.original.id) && "text-primary")}>{title}</p>
        </div>
      )
    }
  },
  {
    accessorKey: "album",
    header: "Album",
    cell: ({ row }) => {
      return (
        <Link to={`/album/${row.original.albumId}`} className="hover:underline">
          {row.original.album}
        </Link>
      )
    }
  },
  {
    accessorKey: "artist",
    header: "Artist",
    cell: ({ row }) => {
      return (
        <Link to={`/album/${row.original.artistId}`} className="hover:underline">
          {row.original.artist}
        </Link>
      )
    }
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => {
      const duration = parseInt(row.getValue('duration'))
      const formattedDuration = convertSecondsToTime(duration)

      return formattedDuration
    }
  },
  {
    accessorKey: "contentType",
    header: "Quality",
    cell: ({ row }) => {
      const contentType = row.getValue('contentType') as string
      const format = contentType.split('/')[1].toUpperCase()

      return <Badge variant="secondary">{format}</Badge>
    }
  },
]

interface PlaySongButtonProps {
  cell: CellContext<ISong, unknown>
}

function PlaySongButton({ cell }: PlaySongButtonProps) {
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
