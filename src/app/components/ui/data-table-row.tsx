import { Cell, flexRender, Row } from '@tanstack/react-table'
import clsx from 'clsx'
import { ComponentPropsWithoutRef, memo, ReactNode, useMemo } from 'react'
import { ContextMenuProvider } from '@/app/components/table/context-menu'
import { usePlayerCurrentSong } from '@/store/player.store'
import { ColumnDefType } from '@/types/react-table/columnDef'

interface RowProps<TData> extends ComponentPropsWithoutRef<'div'> {
  index: number
  row: Row<TData>
  contextMenuOptions: ReactNode
  isPrevRowSelected: (rowIndex: number) => boolean
  isNextRowSelected: (rowIndex: number) => boolean
  variant?: 'classic' | 'modern'
  dataType?: 'song' | 'artist' | 'playlist' | 'radio'
}

const MemoContextMenuProvider = memo(ContextMenuProvider)
const MemoTableCell = memo(TableCell) as typeof TableCell

export function TableRow<TData>({
  index,
  row,
  contextMenuOptions,
  variant,
  dataType,
  isPrevRowSelected,
  isNextRowSelected,
  ...props
}: RowProps<TData>) {
  const currentSong = usePlayerCurrentSong()

  const isClassic = variant === 'classic'
  const isModern = variant === 'modern'

  const isRowSongActive = useMemo(() => {
    if (dataType !== 'song') return false

    // @ts-expect-error row type
    return row.original.id === currentSong.id
  }, [currentSong.id, dataType, row.original])

  return (
    <MemoContextMenuProvider options={contextMenuOptions}>
      <div
        {...props}
        role="row"
        data-test-id="table-row"
        data-state={row.getIsSelected() && 'selected'}
        className={clsx(
          'group/tablerow w-full flex flex-row transition-colors',
          isModern &&
            row.getIsSelected() &&
            !isPrevRowSelected(index) &&
            'rounded-t-md',
          isModern &&
            row.getIsSelected() &&
            !isNextRowSelected(index) &&
            'rounded-b-md',
          isModern && !row.getIsSelected() && 'rounded-md',
          'hover:bg-foreground/20 data-[state=selected]:bg-foreground/30',
          isClassic && 'border-b',
          isRowSongActive && isModern && 'row-active bg-foreground/20',
        )}
      >
        {row.getVisibleCells().map((cell) => (
          <MemoTableCell key={cell.id} cell={cell} />
        ))}
      </div>
    </MemoContextMenuProvider>
  )
}

interface TableCellProps<TData, TValue> {
  cell: Cell<TData, TValue>
}

function TableCell<TData, TValue>({ cell }: TableCellProps<TData, TValue>) {
  const columnDef = cell.column.columnDef as ColumnDefType<TData>

  return (
    <div
      key={cell.id}
      className={clsx(
        'p-2 flex flex-row items-center justify-start [&:has([role=checkbox])]:pr-4',
        columnDef.className,
      )}
      style={columnDef.style}
      role="cell"
    >
      {flexRender(cell.column.columnDef.cell, cell.getContext())}
    </div>
  )
}
