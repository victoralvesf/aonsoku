import clsx from 'clsx'
import { ClockIcon, HeartIcon } from 'lucide-react'
import { memo } from 'react'
import { Link } from 'react-router-dom'

import PlaySongButton from '@/app/components/table/play-button'
import { SongTableActions } from '@/app/components/table/song-actions'
import { TableSongTitle } from '@/app/components/table/song-title'
import { Badge } from '@/app/components/ui/badge'
import { DataTableColumnHeader } from '@/app/components/ui/data-table-column-header'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'
import i18n from '@/i18n'
import { ROUTES } from '@/routes/routesList'
import { ColumnDefType } from '@/types/react-table/columnDef'
import { ISong } from '@/types/responses/song'
import { convertSecondsToTime } from '@/utils/convertSecondsToTime'
import dateTime from '@/utils/dateTime'

const MemoSimpleTooltip = memo(SimpleTooltip)
const MemoBadge = memo(Badge)
const MemoPlaySongButton = memo(PlaySongButton)
const MemoTableSongTitle = memo(TableSongTitle)
const MemoLink = memo(Link)
const MemoSongTableActions = memo(SongTableActions)
const MemoDataTableColumnHeader = memo(
  DataTableColumnHeader,
) as typeof DataTableColumnHeader

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
          <MemoPlaySongButton
            trackNumber={trackNumber}
            trackId={song.id}
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
          <MemoPlaySongButton
            trackNumber={trackNumber}
            trackId={song.id}
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
        minWidth: 250,
      },
      enableSorting: true,
      sortingFn: 'customSortFn',
      header: ({ column, table }) => (
        <MemoDataTableColumnHeader column={column} table={table}>
          {i18n.t('table.columns.title')}
        </MemoDataTableColumnHeader>
      ),
      cell: ({ row }) => <MemoTableSongTitle song={row.original} />,
    },
    {
      id: 'artist',
      accessorKey: 'artist',
      style: {
        width: '15%',
        maxWidth: '15%',
      },
      enableSorting: true,
      sortingFn: 'customSortFn',
      header: ({ column, table }) => (
        <MemoDataTableColumnHeader column={column} table={table}>
          {i18n.t('table.columns.artist')}
        </MemoDataTableColumnHeader>
      ),
      cell: ({ row }) => {
        const { artist, artistId } = row.original

        return (
          <MemoLink
            to={ROUTES.ARTIST.PAGE(artistId ?? '')}
            className={clsx(
              'truncate',
              artistId ? 'hover:underline' : 'pointer-events-none',
            )}
            onContextMenu={(e) => {
              e.stopPropagation()
              e.preventDefault()
            }}
          >
            {artist}
          </MemoLink>
        )
      },
    },
    {
      id: 'album',
      accessorKey: 'album',
      style: {
        width: '15%',
        maxWidth: '15%',
      },
      className: 'hidden lg:flex',
      enableSorting: true,
      sortingFn: 'customSortFn',
      header: ({ column, table }) => (
        <MemoDataTableColumnHeader column={column} table={table}>
          {i18n.t('table.columns.album')}
        </MemoDataTableColumnHeader>
      ),
      cell: ({ row }) => {
        return (
          <MemoLink
            to={ROUTES.ALBUM.PAGE(row.original.albumId)}
            className="hover:underline truncate"
            onContextMenu={(e) => {
              e.stopPropagation()
              e.preventDefault()
            }}
          >
            {row.original.album}
          </MemoLink>
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
      enableSorting: true,
      sortingFn: 'basic',
      header: ({ column, table }) => (
        <MemoSimpleTooltip text={i18n.t('table.columns.duration')}>
          <div>
            <MemoDataTableColumnHeader column={column} table={table}>
              <ClockIcon className="w-4 h-4" />
            </MemoDataTableColumnHeader>
          </div>
        </MemoSimpleTooltip>
      ),
      cell: ({ row }) => {
        const { duration } = row.original
        const formattedDuration = convertSecondsToTime(duration ?? 0)

        return formattedDuration
      },
    },
    {
      id: 'playCount',
      accessorKey: 'playCount',
      style: {
        width: 140,
        maxWidth: 140,
      },
      className: 'hidden lg:flex',
      enableSorting: true,
      sortingFn: 'basic',
      sortUndefined: -1,
      header: ({ column, table }) => (
        <MemoDataTableColumnHeader column={column} table={table}>
          {i18n.t('table.columns.plays')}
        </MemoDataTableColumnHeader>
      ),
      cell: ({ row }) => row.original.playCount ?? 0,
    },
    {
      id: 'played',
      accessorKey: 'played',
      header: i18n.t('table.columns.lastPlayed'),
      style: {
        width: 180,
        maxWidth: 180,
      },
      className: 'hidden 2xl:flex',
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
      className: 'hidden 2xl:flex',
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
      className: 'hidden 2xl:flex',
      cell: ({ row }) => {
        const { suffix } = row.original

        return <MemoBadge>{suffix.toUpperCase()}</MemoBadge>
      },
    },
    {
      id: 'select',
      style: {
        width: 120,
        maxWidth: 120,
        justifyContent: 'end',
      },
      header: () => (
        <MemoSimpleTooltip text={i18n.t('table.columns.favorite')}>
          <HeartIcon className="w-4 h-4 mr-2" />
        </MemoSimpleTooltip>
      ),
      cell: ({ row }) => <MemoSongTableActions row={row} />,
    },
  ]
}
