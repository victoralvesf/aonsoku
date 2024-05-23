import { PlayIcon } from 'lucide-react'
import { Badge } from "@/app/components/ui/badge"
import { PlaylistSong } from "@/types/responses/playlist"
import { ColumnDef } from "@tanstack/react-table"
import dateTime from "@/utils/dateTime"
import { getCoverArtUrl } from "@/api/httpClient"
import Image from "@/app/components/image"
import { Button } from "@/app/components/ui/button"

export const playlistSongsColumns: ColumnDef<PlaylistSong>[] = [
  {
    accessorKey: "index",
    header: () => {
      return <div className="text-center">#</div>
    },
    cell: ({ row, table }) => {
      const trackNumber = row.index + 1
      return (
        <div className="text-center text-foreground flex justify-center">
          <div className="group-hover/tablerow:hidden w-8">
            {trackNumber}
          </div>
          <div className="hidden group-hover/tablerow:flex justify-center">
            <Button
              className="w-8 h-8 rounded-full hover:bg-white dark:hover:bg-slate-950"
              size="icon"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                table.options.meta?.handlePlaySong?.(row)
              }}
            >
              <PlayIcon className="w-3 h-3 opacity-80 fill-inherit dark:fill-slate-50" strokeWidth={4} />
            </Button>
          </div>
        </div>
      )
    },
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const coverArt = row.original.coverArt
      const title = row.original.title

      return (
        <div className="flex gap-2 items-center">
          <Image
            src={getCoverArtUrl(coverArt, '80')}
            alt={title}
            width={40}
            height={40}
            className="rounded shadow-md"
          />
          {title}
        </div>
      )
    }
  },
  {
    accessorKey: "album",
    header: "Album",
  },
  {
    accessorKey: "artist",
    header: "Artist",
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => {
      const duration = parseInt(row.getValue('duration'))
      const formattedDuration = dateTime.duration(duration, 'seconds').format('mm:ss')

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
