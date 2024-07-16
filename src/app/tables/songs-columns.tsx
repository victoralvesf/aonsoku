import { ClockIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

import PlaySongButton from '@/app/components/table/play-button'
import {
  SelectSongCell,
  SelectSongHeader,
} from '@/app/components/table/select-song'
import { TableSongTitle } from '@/app/components/table/song-title'
import { Badge } from '@/app/components/ui/badge'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'
import i18n from '@/i18n'
import { ROUTES } from '@/routes/routesList'
import { ColumnDefType } from '@/types/react-table/columnDef'
import { ISong } from '@/types/responses/song'
import { convertSecondsToTime } from '@/utils/convertSecondsToTime'
import dateTime from '@/utils/dateTime'

export function songsColumns(): ColumnDefType<ISong>[] {
  return [
    {
      id: 'index',
      accessorKey: 'index',
      style: {
        width: 48,
        minWidth: '48px',
      },
      header: () => {
        return <div className="w-full text-center">#</div>
      },
      cell: ({ row, table }) => {
        const trackNumber = row.index + 1
        const song = row.original

        return (
          <PlaySongButton
            type="song"
            trackNumber={trackNumber}
            trackId={song.id}
            title={song.title}
            artist={song.artist}
            handlePlayButton={() => table.options.meta?.handlePlaySong?.(row)}
          />
        )
      },
    },
    {
      id: 'trackNumber',
      accessorKey: 'track',
      style: {
        width: 48,
        minWidth: '48px',
      },
      header: () => {
        return <div className="w-full text-center">#</div>
      },
      cell: ({ row, table }) => {
        const song = row.original
        const trackNumber = song.track

        return (
          <PlaySongButton
            type="song"
            trackNumber={trackNumber}
            trackId={song.id}
            title={song.title}
            artist={song.artist}
            handlePlayButton={() => table.options.meta?.handlePlaySong?.(row)}
          />
        )
      },
    },
    {
      id: 'title',
      accessorKey: 'title',
      style: {
        flex: 1,
        minWidth: '100px',
      },
      header: i18n.t('table.columns.title'),
      cell: ({ row }) => <TableSongTitle song={row.original} />,
    },
    {
      id: 'artist',
      accessorKey: 'artist',
      style: {
        width: '15%',
        maxWidth: '15%',
      },
      header: i18n.t('table.columns.artist'),
      cell: ({ row }) => {
        if (!row.original.artistId) return row.original.artist

        return (
          <Link
            to={ROUTES.ARTIST.PAGE(row.original.artistId)}
            className="hover:underline truncate"
          >
            {row.original.artist}
          </Link>
        )
      },
    },
    {
      id: 'album',
      accessorKey: 'album',
      header: i18n.t('table.columns.album'),
      style: {
        width: '15%',
        maxWidth: '15%',
      },
      cell: ({ row }) => {
        return (
          <Link
            to={ROUTES.ALBUM.PAGE(row.original.albumId)}
            className="hover:underline truncate"
          >
            {row.original.album}
          </Link>
        )
      },
    },
    {
      id: 'year',
      accessorKey: 'year',
      header: i18n.t('table.columns.year'),
      style: {
        width: 80,
        maxWidth: 80,
      },
    },
    {
      id: 'duration',
      accessorKey: 'duration',
      style: {
        width: 80,
        maxWidth: 80,
      },
      header: () => (
        <SimpleTooltip text={i18n.t('table.columns.duration')}>
          <ClockIcon className="w-4 h-4" />
        </SimpleTooltip>
      ),
      cell: ({ row }) => {
        const duration = row.original.duration
        const formattedDuration = convertSecondsToTime(duration)

        return formattedDuration
      },
    },
    {
      id: 'playCount',
      accessorKey: 'playCount',
      header: i18n.t('table.columns.plays'),
      style: {
        width: 140,
        maxWidth: 140,
      },
      cell: ({ row }) => {
        const playCount = row.original.playCount

        return playCount || 0
      },
    },
    {
      id: 'played',
      accessorKey: 'played',
      header: i18n.t('table.columns.lastPlayed'),
      style: {
        width: 180,
        maxWidth: 180,
      },
      cell: ({ row }) => {
        const { played } = row.original

        if (played) {
          const lastPlayed = dateTime().from(dateTime(played), true)
          return i18n.t('table.lastPlayed', { date: lastPlayed })
        }

        return ''
      },
    },
    {
      id: 'bpm',
      accessorKey: 'bpm',
      header: i18n.t('table.columns.bpm'),
      style: {
        width: 80,
        maxWidth: 80,
      },
    },
    {
      id: 'bitRate',
      accessorKey: 'bitRate',
      header: i18n.t('table.columns.bitrate'),
      style: {
        width: 140,
        maxWidth: 140,
      },
      cell: ({ row }) => {
        return `${row.original.bitRate} kbps`
      },
    },
    {
      id: 'contentType',
      accessorKey: 'contentType',
      header: i18n.t('table.columns.quality'),
      style: {
        width: 120,
        maxWidth: 120,
      },
      cell: ({ row }) => {
        const { suffix } = row.original

        return <Badge>{suffix.toUpperCase()}</Badge>
      },
    },
    {
      id: 'select',
      style: {
        width: 120,
        maxWidth: 120,
        justifyContent: 'end',
      },
      header: ({ table }) => <SelectSongHeader table={table} />,
      cell: ({ row }) => <SelectSongCell row={row} />,
    },
  ]
}
