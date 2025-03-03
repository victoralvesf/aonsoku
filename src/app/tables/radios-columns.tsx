import { RadioActionButton } from '@/app/components/radios/action-button'
import PlaySongButton from '@/app/components/table/play-button'
import { TableRadioTitle } from '@/app/components/table/radio-title'
import { DataTableColumnHeader } from '@/app/components/ui/data-table-column-header'
import i18n from '@/i18n'
import { ColumnDefType } from '@/types/react-table/columnDef'
import { Radio } from '@/types/responses/radios'

export function radiosColumns(): ColumnDefType<Radio>[] {
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
        const radio = row.original

        return (
          <PlaySongButton
            trackNumber={trackNumber}
            trackId={radio.id}
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
          {i18n.t('radios.table.name')}
        </DataTableColumnHeader>
      ),
      cell: ({ row }) => <TableRadioTitle name={row.original.name} />,
    },
    {
      id: 'homePageUrl',
      accessorKey: 'homePageUrl',
      style: {
        width: '25%',
        maxWidth: '25%',
      },
      header: i18n.t('radios.table.homepage'),
      cell: ({ row }) => {
        const { homePageUrl } = row.original

        if (!homePageUrl) return ''

        return (
          <div className="truncate">
            <p className="truncate text-primary">
              <a
                href={homePageUrl}
                target="_blank"
                rel="nofollow noreferrer"
                className="hover:underline"
              >
                {homePageUrl}
              </a>
            </p>
          </div>
        )
      },
    },
    {
      id: 'streamUrl',
      accessorKey: 'streamUrl',
      style: {
        width: '25%',
        maxWidth: '25%',
        marginRight: '1rem',
      },
      header: i18n.t('radios.table.stream'),
      cell: ({ row }) => (
        <div className="truncate">
          <p className="truncate">{row.original.streamUrl}</p>
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
        return <RadioActionButton row={row.original} />
      },
    },
  ]
}
