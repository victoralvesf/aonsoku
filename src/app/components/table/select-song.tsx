import { Row, Table } from '@tanstack/react-table'
import { EllipsisVertical } from 'lucide-react'
import { SelectedSongsOptions } from '@/app/components/song/selected-songs-options'
import { SongOptions } from '@/app/components/song/song-options'
import { TableActionButton } from '@/app/components/table/action-button'
import { TableLikeButton } from '@/app/components/table/like-button'
import { Button } from '@/app/components/ui/button'
import { Checkbox } from '@/app/components/ui/checkbox'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu'
import { ISong } from '@/types/responses/song'

export function SelectSongHeader({ table }: { table: Table<ISong> }) {
  const hasSomeRowSelected =
    table.getIsAllPageRowsSelected() ||
    (table.getIsSomePageRowsSelected() && 'indeterminate')

  return (
    <>
      {hasSomeRowSelected && (
        <DropdownMenu>
          <DropdownMenuTrigger
            asChild
            className="outline-none focus-visible:ring-0 focus-visible:ring-transparent"
          >
            <Button
              size="icon"
              variant="ghost"
              className="mr-3 rounded-full w-8 h-8 data-[state=open]:bg-accent"
            >
              <EllipsisVertical className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <SelectedSongsOptions table={table} />
          </DropdownMenuContent>
        </DropdownMenu>
      )}
      <Checkbox
        checked={hasSomeRowSelected}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    </>
  )
}

interface SelectSongCellProps {
  row: Row<ISong>
}

export function SelectSongCell({ row }: SelectSongCellProps) {
  return (
    <div className="flex gap-1 items-center">
      <TableLikeButton
        type="song"
        entityId={row.original.id}
        starred={typeof row.original.starred === 'string'}
      />
      <TableActionButton
        optionsMenuItems={<SongOptions song={row.original} index={row.index} />}
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
