import { Badge } from "@/app/components/ui/badge"
import { ISong } from "@/types/responses/song"
import { ColumnDef } from "@tanstack/react-table"
import { convertSecondsToTime } from '@/utils/convertSecondsToTime'
import { getCoverArtUrl } from "@/api/httpClient"
import Image from "@/app/components/image"
import { Link } from 'react-router-dom'
import { usePlayer } from '@/app/contexts/player-context'
import clsx from 'clsx'
import PlaySongButton from '@/app/components/table/play-button'

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
        <Link to={`/library/albums/${row.original.albumId}`} className="hover:underline">
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
        <Link to={`/library/artists/${row.original.artistId}`} className="hover:underline">
          {row.original.artist}
        </Link>
      )
    }
  },
  {
    accessorKey: "duration",
    header: "Duration",
    cell: ({ row }) => {
      const duration = row.original.duration
      const formattedDuration = convertSecondsToTime(duration)

      return formattedDuration
    }
  },
  {
    accessorKey: "contentType",
    header: "Quality",
    cell: ({ row }) => {
      const { suffix } = row.original

      return <Badge variant="secondary">{suffix.toUpperCase()}</Badge>
    }
  },
]
