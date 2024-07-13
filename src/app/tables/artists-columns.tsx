import { ColumnDef } from '@tanstack/react-table'
import { Link } from 'react-router-dom'

import { getCoverArtUrl } from '@/api/httpClient'
import { TableLikeButton } from '@/app/components/table/like-button'
import PlaySongButton from '@/app/components/table/play-button'
import { DataTableColumnHeader } from '@/app/components/ui/data-table-column-header'
import i18n from '@/i18n'
import { ROUTES } from '@/routes/routesList'
import { ISimilarArtist } from '@/types/responses/artist'

export function artistsColumns(): ColumnDef<ISimilarArtist>[] {
  return [
    {
      id: 'index',
      accessorKey: 'index',
      header: () => {
        return <div className="text-center">#</div>
      },
      cell: ({ row, table }) => {
        const index = row.index + 1
        const artist = row.original

        return (
          <PlaySongButton
            type="artist"
            trackNumber={index}
            trackId={artist.id}
            title={artist.name}
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
            className="w-[40px] h-[40px] min-w-[40px] min-h-[40px] aspect-square bg-cover bg-center rounded shadow-md bg-skeleton"
            style={{
              backgroundImage: `url(${getCoverArtUrl(row.original.coverArt, '80')})`,
            }}
          />
          <div className="flex flex-col justify-center items-center">
            <Link
              to={ROUTES.ARTIST.PAGE(row.original.id)}
              className="hover:underline flex w-fit"
            >
              <p>{row.original.name}</p>
            </Link>
          </div>
        </div>
      ),
    },
    {
      id: 'albumCount',
      accessorKey: 'albumCount',
      enableSorting: true,
      sortingFn: 'alphanumeric',
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={i18n.t('table.columns.albumCount')}
        />
      ),
    },
    {
      id: 'starred',
      accessorKey: 'starred',
      header: '',
      size: 40,
      maxSize: 40,
      cell: ({ row }) => {
        const { starred, id } = row.original

        return (
          <TableLikeButton
            type="artist"
            entityId={id}
            starred={typeof starred === 'string'}
          />
        )
      },
    },
  ]
}
