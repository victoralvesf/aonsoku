import { Badge } from "@/app/components/ui/badge"
import { PlaylistSong } from "@/types/responses/playlist"
import { ColumnDef } from "@tanstack/react-table"
import dateTime from "@/utils/dateTime"
import { getCoverArtUrl } from "@/api/httpClient"

export const playlistSongsColumns: ColumnDef<PlaylistSong>[] = [
  {
    accessorKey: "index",
    header: "#",
    cell: ({ row }) => {
      const trackNumber = row.index + 1
      return trackNumber
    }
  },
  {
    accessorKey: "title",
    header: "Title",
    cell: ({ row }) => {
      const coverArt = row.original.coverArt
      const title = row.original.title

      return (
        <div className="flex gap-2 items-center">
          <img
            src={getCoverArtUrl(coverArt, '100')}
            alt={title}
            width={50}
            height={50}
            className="rounded-lg shadow-md"
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

      return <Badge variant="outline">{format}</Badge>
    }
  },
]
