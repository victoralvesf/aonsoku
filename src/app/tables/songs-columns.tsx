import { Badge } from "@/app/components/ui/badge"
import { ISong } from "@/types/responses/song"
import { ColumnDef } from "@tanstack/react-table"
import { convertSecondsToTime } from '@/utils/convertSecondsToTime'
import { getCoverArtUrl } from "@/api/httpClient"
import Image from "@/app/components/image"
import { Link } from 'react-router-dom'
import { usePlayer } from '@/app/contexts/player-context'
import clsx from 'clsx'
import PlaySongButton from "@/app/components/table/play-button"
import dateTime from "@/utils/dateTime"
import { Button } from "@/app/components/ui/button"
import { Heart } from "lucide-react"
import { subsonic } from "@/service/subsonic"
import { useState } from "react"

export const songsColumns: ColumnDef<ISong>[] = [
  {
    id: "index",
    accessorKey: "index",
    header: () => {
      return <div className="text-center">#</div>
    },
    cell: (cell) => {
      return <PlaySongButton cell={cell} />
    },
  },
  {
    id: "title",
    accessorKey: "title",
    header: "Title",
    maxSize: 600,
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
    id: "artist",
    accessorKey: "artist",
    header: "Artist",
    cell: ({ row }) => {
      if (!row.original.artistId) return row.original.artist

      return (
        <Link to={`/library/artists/${row.original.artistId}`} className="hover:underline">
          {row.original.artist}
        </Link>
      )
    }
  },
  {
    id: "album",
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
    id: "year",
    accessorKey: "year",
    header: "Year",
    minSize: 55,
    maxSize: 60,
  },
  {
    id: "duration",
    accessorKey: "duration",
    header: "Duration",
    minSize: 80,
    maxSize: 90,
    cell: ({ row }) => {
      const duration = row.original.duration
      const formattedDuration = convertSecondsToTime(duration)

      return formattedDuration
    }
  },
  {
    id: "playCount",
    accessorKey: "playCount",
    header: "Plays",
    size: 70,
    cell: ({ row }) => {
      const playCount = row.original.playCount

      return playCount ? playCount : 0
    }
  },
  {
    id: "played",
    accessorKey: "played",
    header: "Last Played",
    cell: ({ row }) => {
      const { played } = row.original

      if (played) {
        const lastPlayed = dateTime().from(dateTime(played), true)
        return `${lastPlayed} ago`
      }

      return ''
    }
  },
  {
    id: "bpm",
    accessorKey: "bpm",
    header: "BPM"
  },
  {
    id: "bitRate",
    accessorKey: "bitRate",
    header: "Bitrate",
    cell: ({ row }) => {
      return `${row.original.bitRate} kbps`
    }
  },
  {
    id: "contentType",
    accessorKey: "contentType",
    header: "Quality",
    size: 80,
    cell: ({ row }) => {
      const { suffix } = row.original

      return <Badge variant="secondary">{suffix.toUpperCase()}</Badge>
    }
  },
  {
    id: "starred",
    accessorKey: "starred",
    header: "",
    size: 40,
    maxSize: 40,
    cell: ({ row }) => {
      const { starred, id } = row.original
      const [isStarred, setIsStarred] = useState(starred ? true : false)

      async function handleStarred() {
        if (isStarred) {
          await subsonic.star.unstarItem(id)
          setIsStarred(false)
        } else {
          await subsonic.star.starItem(id)
          setIsStarred(true)
        }
      }

      return (
        <Button
          variant="ghost"
          className="rounded-full w-8 h-8 p-1 hover:border hover:bg-white dark:hover:bg-slate-950 hover:shadow-sm"
          onClick={handleStarred}
        >
          <Heart className={clsx("w-4 h-4", isStarred && "text-red-500 fill-red-500")} strokeWidth={2} />
        </Button>
      )
    }
  }
]
