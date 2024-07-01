/* eslint-disable react-hooks/rules-of-hooks */
import { ColumnDef } from '@tanstack/react-table'
import { CheckIcon, ClockIcon, XIcon } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'

import { getCoverArtUrl } from '@/api/httpClient'
import { PlaylistOptions } from '@/app/components/playlist/options'
import { RemovePlaylistDialog } from '@/app/components/playlist/remove-dialog'
import { TableActionButton } from '@/app/components/table/action-button'
import PlaySongButton from '@/app/components/table/play-button'
import { DataTableColumnHeader } from '@/app/components/ui/data-table-column-header'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'
import i18n from '@/i18n'
import { ROUTES } from '@/routes/routesList'
import { Playlist } from '@/types/responses/playlist'
import { convertSecondsToTime } from '@/utils/convertSecondsToTime'

export function playlistsColumns(): ColumnDef<Playlist>[] {
  return [
    {
      id: 'index',
      accessorKey: 'index',
      header: () => {
        return <div className="text-center">#</div>
      },
      cell: ({ row, table }) => {
        const index = row.index + 1
        const playlist = row.original

        return (
          <PlaySongButton
            type="playlist"
            trackNumber={index}
            trackId={playlist.id}
            title={playlist.name}
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
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={i18n.t('table.columns.name')}
        />
      ),
      cell: ({ row }) => (
        <div className="flex gap-2 items-center min-w-[200px] 2xl:min-w-[350px]">
          <div
            className="w-[40px] h-[40px] min-w-[40px] min-h-[40px] aspect-square bg-cover bg-center rounded shadow-md bg-foreground/10"
            style={{
              backgroundImage: `url(${getCoverArtUrl(row.original.coverArt, '80')})`,
            }}
          />
          <div className="flex flex-col justify-center items-center">
            <Link
              to={ROUTES.PLAYLIST.PAGE(row.original.id)}
              className="hover:underline flex w-fit"
            >
              <p>{row.original.name}</p>
            </Link>
          </div>
        </div>
      ),
    },
    {
      id: 'comment',
      accessorKey: 'comment',
      header: i18n.t('table.columns.comment'),
      cell: ({ row }) => (
        <div className="text-muted-foreground">
          <p>{row.original.comment}</p>
        </div>
      ),
    },
    {
      id: 'songCount',
      accessorKey: 'songCount',
      enableSorting: true,
      sortingFn: 'alphanumeric',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={i18n.t('table.columns.songCount')}
        />
      ),
    },
    {
      id: 'duration',
      accessorKey: 'duration',
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
      id: 'public',
      accessorKey: 'public',
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
      header: '',
      size: 40,
      maxSize: 40,
      cell: ({ row }) => {
        const playlist = row.original
        const disableOption = playlist.songCount === 0
        const [removeDialogState, setRemoveDialogState] = useState(false)

        return (
          <>
            <TableActionButton
              optionsMenuItems={
                <PlaylistOptions
                  playlist={playlist}
                  onRemovePlaylist={() => setRemoveDialogState(true)}
                  disablePlayNext={disableOption}
                  disableAddLast={disableOption}
                  disableDownload={disableOption}
                />
              }
            />
            <RemovePlaylistDialog
              playlistId={playlist.id}
              openDialog={removeDialogState}
              setOpenDialog={setRemoveDialogState}
            />
          </>
        )
      },
    },
  ]
}
