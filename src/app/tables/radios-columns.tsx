import { ColumnDef } from '@tanstack/react-table'

import { Radio } from '@/types/responses/radios'
import i18n from '@/i18n'

import { RadioActionButton } from '@/app/components/radios/action-button'
import PlaySongButton from '@/app/components/table/play-button'

export function fillRadiosColumns(): ColumnDef<Radio>[] {
  return [
    {
      id: 'index',
      accessorKey: 'index',
      header: () => {
        return <div className="text-center">#</div>
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
      header: i18n.t('radios.table.name'),
      cell: ({ row }) => (
        <div className="min-w-[200px] 2xl:min-w-[350px]">
          <p>{row.original.name}</p>
        </div>
      ),
    },
    {
      id: 'homePageUrl',
      accessorKey: 'homePageUrl',
      header: i18n.t('radios.table.homepage'),
      cell: ({ row }) => {
        const { homePageUrl } = row.original

        if (!homePageUrl) return ''

        return (
          <div className="max-w-[250px] 2xl:max-w-[400px]">
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
      header: i18n.t('radios.table.stream'),
      cell: ({ row }) => (
        <div className="max-w-[250px] 2xl:max-w-[500px]">
          <p className="truncate">{row.original.streamUrl}</p>
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
        return <RadioActionButton row={row.original} />
      },
    },
  ]
}
