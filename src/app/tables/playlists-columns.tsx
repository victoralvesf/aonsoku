import { CheckIcon, ClockIcon, XIcon } from 'lucide-react'
import { Link } from 'react-router-dom'

import { PlaylistOptions } from '@/app/components/playlist/options'
import { TableActionButton } from '@/app/components/table/action-button'
import { CoverImage } from '@/app/components/table/cover-image'
import PlaySongButton from '@/app/components/table/play-button'
import { DataTableColumnHeader } from '@/app/components/ui/data-table-column-header'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'
import i18n from '@/i18n'
import { ROUTES } from '@/routes/routesList'
import { ColumnDefType } from '@/types/react-table/columnDef'
import { Playlist } from '@/types/responses/playlist'
import { convertSecondsToTime } from '@/utils/convertSecondsToTime'

export function playlistsColumns(): ColumnDefType<Playlist>[] {
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
        const index = row.index + 1
        const playlist = row.original

        return (
          <PlaySongButton
            trackNumber={index}
            trackId={playlist.id}
            handlePlayButton={() => table.options.meta?.handlePlaySong?.(row)}
          />
        )
      },
    },
    {
      id: 'name',
      accessorKey: 'name',
      enableSorting: true,
      sortingFn: 'customSortFn',
      style: {
        flex: 1,
        minWidth: 250,
      },
      header: ({ column, table }) => (
        <DataTableColumnHeader column={column} table={table}>
          {i18n.t('table.columns.name')}
        </DataTableColumnHeader>
      ),
      cell: ({ row }) => (
        <div className="flex gap-2 items-center w-full">
          <CoverImage
            coverArt={row.original.coverArt}
            coverArtType="playlist"
            altText={row.original.name}
          />
          <div className="flex flex-col max-w-full justify-center truncate">
            <Link
              to={ROUTES.PLAYLIST.PAGE(row.original.id)}
              className="hover:underline truncate"
            >
              {row.original.name}
            </Link>
          </div>
        </div>
      ),
    },
    {
      id: 'comment',
      accessorKey: 'comment',
      style: {
        width: '25%',
        maxWidth: '25%',
        marginRight: '1rem',
      },
      className: 'hidden 2xl:flex',
      header: i18n.t('table.columns.comment'),
      cell: ({ row }) => (
        <div className="text-muted-foreground w-full truncate">
          <p className="truncate">{row.original.comment}</p>
        </div>
      ),
    },
    {
      id: 'songCount',
      accessorKey: 'songCount',
      enableSorting: true,
      sortingFn: 'basic',
      style: {
        width: 190,
        maxWidth: 190,
      },
      header: ({ column, table }) => (
        <DataTableColumnHeader column={column} table={table}>
          {i18n.t('table.columns.songCount')}
        </DataTableColumnHeader>
      ),
    },
    {
      id: 'duration',
      accessorKey: 'duration',
      style: {
        width: 100,
        maxWidth: 100,
      },
      header: () => (
        <SimpleTooltip text={i18n.t('table.columns.duration')}>
          <ClockIcon className="w-4 h-4" />
        </SimpleTooltip>
      ),
      cell: ({ row }) => {
        const { duration } = row.original
        const formattedDuration = convertSecondsToTime(duration ?? 0)

        return formattedDuration
      },
    },
    {
      id: 'public',
      accessorKey: 'public',
      style: {
        width: 100,
        maxWidth: 100,
      },
      header: i18n.t('table.columns.public'),
      cell: ({ row }) => (
        <div>
          {row.original.public ? (
            <CheckIcon className="w-5 h-5 text-green-500" />
          ) : (
            <XIcon className="w-5 h-5 text-red-500" />
          )}
        </div>
      ),
    },
    {
      id: 'actions',
      accessorKey: 'actions',
      style: {
        width: 48,
        maxWidth: 48,
      },
      header: '',
      cell: ({ row }) => {
        const playlist = row.original
        const disableOption = playlist.songCount === 0

        return (
          <>
            <TableActionButton
              optionsMenuItems={
                <PlaylistOptions
                  playlist={playlist}
                  disablePlayNext={disableOption}
                  disableAddLast={disableOption}
                  disableDownload={disableOption}
                />
              }
            />
          </>
        )
      },
    },
  ]
}
