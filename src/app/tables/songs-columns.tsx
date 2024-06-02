import { useEffect, useState } from "react"
import { Heart } from "lucide-react"
import { Link } from 'react-router-dom'
import { ColumnDef } from "@tanstack/react-table"
import clsx from 'clsx'

import { Badge } from "@/app/components/ui/badge"
import { ISong } from "@/types/responses/song"
import { convertSecondsToTime } from '@/utils/convertSecondsToTime'
import { getCoverArtUrl } from "@/api/httpClient"
import Image from "@/app/components/image"
import { usePlayer } from '@/app/contexts/player-context'
import PlaySongButton from "@/app/components/table/play-button"
import dateTime from "@/utils/dateTime"
import { Button } from "@/app/components/ui/button"
import { subsonic } from "@/service/subsonic"
import { ROUTES } from "@/routes/routesList"
import i18n from '@/i18n'

function fillSongsColumns(): ColumnDef<ISong>[] {
  return [
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
      header: i18n.t('table.columns.title'),
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
      header: i18n.t('table.columns.artist'),
      cell: ({ row }) => {
        if (!row.original.artistId) return row.original.artist

        return (
          <Link to={ROUTES.ARTIST.PAGE(row.original.artistId)} className="hover:underline">
            {row.original.artist}
          </Link>
        )
      }
    },
    {
      id: "album",
      accessorKey: "album",
      header: i18n.t('table.columns.album'),
      cell: ({ row }) => {
        return (
          <Link to={ROUTES.ALBUM.PAGE(row.original.albumId)} className="hover:underline">
            {row.original.album}
          </Link>
        )
      }
    },
    {
      id: "year",
      accessorKey: "year",
      header: i18n.t('table.columns.year'),
      minSize: 55,
      maxSize: 60,
    },
    {
      id: "duration",
      accessorKey: "duration",
      header: i18n.t('table.columns.duration'),
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
      header: i18n.t('table.columns.plays'),
      size: 70,
      cell: ({ row }) => {
        const playCount = row.original.playCount

        return playCount ? playCount : 0
      }
    },
    {
      id: "played",
      accessorKey: "played",
      header: i18n.t('table.columns.lastPlayed'),
      cell: ({ row }) => {
        const { played } = row.original

        if (played) {
          const lastPlayed = dateTime().from(dateTime(played), true)
          return i18n.t('table.lastPlayed', { date: lastPlayed })
        }

        return ''
      }
    },
    {
      id: "bpm",
      accessorKey: "bpm",
      header: i18n.t('table.columns.bpm')
    },
    {
      id: "bitRate",
      accessorKey: "bitRate",
      header: i18n.t('table.columns.bitrate'),
      cell: ({ row }) => {
        return `${row.original.bitRate} kbps`
      }
    },
    {
      id: "contentType",
      accessorKey: "contentType",
      header: i18n.t('table.columns.quality'),
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
        const [isStarredLocal, setIsStarredLocal] = useState(starred ? true : false)
        const { checkActiveSong, isSongStarred, setIsSongStarred } = usePlayer()

        useEffect(() => {
          const isSongPlaying = checkActiveSong(id)

          if (isSongPlaying) setIsStarredLocal(isSongStarred)
        }, [isSongStarred])

        async function handleStarred() {
          const state = !isStarredLocal

          await subsonic.star.handleStarItem(id, isStarredLocal)
          setIsStarredLocal(state)

          const isSongPlaying = checkActiveSong(id)
          if (isSongPlaying) setIsSongStarred(state)
        }

        return (
          <Button
            variant="ghost"
            className="rounded-full w-8 h-8 p-1 hover:border hover:bg-white dark:hover:bg-slate-950 hover:shadow-sm"
            onClick={handleStarred}
          >
            <Heart className={clsx("w-4 h-4", isStarredLocal && "text-red-500 fill-red-500")} strokeWidth={2} />
          </Button>
        )
      }
    }
  ]
}

let songsColumns = fillSongsColumns()

i18n.on('languageChanged', () => {
  songsColumns = fillSongsColumns()
})

export {
  songsColumns
}
