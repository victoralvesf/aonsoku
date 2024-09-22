import { Link } from 'react-router-dom'

import { CoverImage } from '@/app/components/table/cover-image'
import { TableLikeButton } from '@/app/components/table/like-button'
import PlaySongButton from '@/app/components/table/play-button'
import { DataTableColumnHeader } from '@/app/components/ui/data-table-column-header'
import i18n from '@/i18n'
import { ROUTES } from '@/routes/routesList'
import { ColumnDefType } from '@/types/react-table/columnDef'
import { ISimilarArtist } from '@/types/responses/artist'

export function artistsColumns(): ColumnDefType<ISimilarArtist>[] {
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
      style: {
        flex: 1,
        minWidth: 100,
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column}>
          {i18n.t('table.columns.name')}
        </DataTableColumnHeader>
      ),
      cell: ({ row }) => (
        <div className="flex gap-2 items-center min-w-[200px] 2xl:min-w-[350px]">
          <CoverImage
            coverArt={row.original.coverArt}
            coverArtType="artist"
            altText={row.original.name}
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
      sortingFn: 'basic',
      style: {
        width: 140,
        minWidth: 140,
      },
      header: ({ column }) => (
        <DataTableColumnHeader column={column}>
          {i18n.t('table.columns.albumCount')}
        </DataTableColumnHeader>
      ),
    },
    {
      id: 'starred',
      accessorKey: 'starred',
      header: '',
      style: {
        width: 48,
        maxWidth: 48,
      },
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
