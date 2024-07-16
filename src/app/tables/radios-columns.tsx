import { RadioIcon } from 'lucide-react'

import { RadioActionButton } from '@/app/components/radios/action-button'
import PlaySongButton from '@/app/components/table/play-button'
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
            type="radio"
            trackNumber={trackNumber}
            trackId={radio.id}
            title={radio.name}
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
        minWidth: '100px',
      },
      header: ({ column }) => (
        <DataTableColumnHeader
          column={column}
          title={i18n.t('radios.table.name')}
        />
      ),
      cell: ({ row }) => (
        <div className="flex gap-2 items-center min-w-[200px] 2xl:min-w-[350px]">
          <div className="flex justify-center items-center w-[40px] h-[40px] min-w-[40px] min-h-[40px] rounded shadow bg-foreground/20 dark:bg-accent">
            <RadioIcon className="w-5 h-5 text-foreground" strokeWidth={1.75} />
          </div>
          <div className="flex flex-col justify-center items-center">
            <p>{row.original.name}</p>
          </div>
        </div>
      ),
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
