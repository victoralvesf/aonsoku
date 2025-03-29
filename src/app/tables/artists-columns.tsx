import { memo } from 'react'
import { ArtistTitle } from '@/app/components/table/artist-title.tsx'
import { TableLikeButton } from '@/app/components/table/like-button'
import PlaySongButton from '@/app/components/table/play-button'
import { DataTableColumnHeader } from '@/app/components/ui/data-table-column-header'
import i18n from '@/i18n'
import { ColumnDefType } from '@/types/react-table/columnDef'
import { ISimilarArtist } from '@/types/responses/artist'

const MemoArtistTitle = memo(ArtistTitle)
const MemoPlaySongButton = memo(PlaySongButton)
const MemoDataTableColumnHeader = memo(
  DataTableColumnHeader,
) as typeof DataTableColumnHeader
const MemoTableLikeButton = memo(TableLikeButton)

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
          <MemoPlaySongButton
            trackNumber={index}
            trackId={artist.id}
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
      header: ({ column, table }) => (
        <MemoDataTableColumnHeader column={column} table={table}>
          {i18n.t('table.columns.name')}
        </MemoDataTableColumnHeader>
      ),
      cell: ({ row }) => <MemoArtistTitle artist={row.original} />,
    },
    {
      id: 'albumCount',
      accessorKey: 'albumCount',
      enableSorting: true,
      sortingFn: 'basic',
      style: {
        width: '15%',
        maxWidth: '15%',
      },
      header: ({ column, table }) => (
        <MemoDataTableColumnHeader column={column} table={table}>
          {i18n.t('table.columns.albumCount')}
        </MemoDataTableColumnHeader>
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
          <MemoTableLikeButton
            type="artist"
            entityId={id}
            starred={typeof starred === 'string'}
          />
        )
      },
    },
  ]
}
