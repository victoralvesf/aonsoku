import { Row, Table } from '@tanstack/react-table'
import { EllipsisVertical } from 'lucide-react'
import { SongOptions } from '@/app/components/song/song-options'
import { TableActionButton } from '@/app/components/table/action-button'
import { TableLikeButton } from '@/app/components/table/like-button'
import { Button } from '@/app/components/ui/button'
import { Checkbox } from '@/app/components/ui/checkbox'
import { ISong } from '@/types/responses/song'

export function SelectSongHeader({ table }: { table: Table<ISong> }) {
  const hasSomeRowSelected =
    table.getIsAllPageRowsSelected() ||
    (table.getIsSomePageRowsSelected() && 'indeterminate')

  return (
    <>
      {hasSomeRowSelected && (
        <Button
          size="icon"
          variant="ghost"
          className="mr-3 rounded-full w-8 h-8"
        >
          <EllipsisVertical className="w-4 h-4" />
        </Button>
      )}
      <Checkbox
        checked={hasSomeRowSelected}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    </>
  )
}

export function SelectSongCell({ row }: { row: Row<ISong> }) {
  return (
    <div className="flex gap-1 items-center">
      <TableLikeButton
        type="song"
        entityId={row.original.id}
        starred={typeof row.original.starred === 'string'}
      />
      <TableActionButton
        optionsMenuItems={<SongOptions song={row.original} />}
      />
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="ml-2"
      />
    </div>
  )
}
