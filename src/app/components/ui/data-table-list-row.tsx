import { Cell, flexRender, Row } from '@tanstack/react-table'
import clsx from 'clsx'
import { memo, MouseEvent, TouchEvent } from 'react'
import { ContextMenuProvider } from '@/app/components/table/context-menu'
import { ColumnDefType } from '@/types/react-table/columnDef'

const MemoContextMenuProvider = memo(ContextMenuProvider)
const MemoTableCell = memo(TableCell) as typeof TableCell

interface TableRowProps<TData> {
  row: Row<TData>
  virtualRow: { index: number; size: number; start: number }
  handleClicks: (e: MouseEvent<HTMLDivElement>, row: Row<TData>) => void
  handleRowDbClick: (e: MouseEvent<HTMLDivElement>, row: Row<TData>) => void
  handleRowTap: (e: TouchEvent<HTMLDivElement>, row: Row<TData>) => void
  getContextMenuOptions: (row: Row<TData>) => JSX.Element | undefined
}

let isTap = false
let tapTimeout: NodeJS.Timeout

export function TableListRow<TData>({
  row,
  virtualRow,
  handleClicks,
  handleRowDbClick,
  handleRowTap,
  getContextMenuOptions,
}: TableRowProps<TData>) {
  function handleTouchStart() {
    isTap = true
    tapTimeout = setTimeout(() => {
      isTap = false
    }, 500)
  }

  function handleTouchMove() {
    isTap = false
  }

  function handleTouchEnd(e: TouchEvent<HTMLDivElement>) {
    clearTimeout(tapTimeout)
    if (isTap) handleRowTap(e, row)
  }

  function handleTouchCancel() {
    clearTimeout(tapTimeout)
    isTap = false
  }

  return (
    <MemoContextMenuProvider options={getContextMenuOptions(row)}>
      <div
        role="row"
        data-row-index={virtualRow.index}
        data-state={row.getIsSelected() && 'selected'}
        onClick={(e) => handleClicks(e, row)}
        onDoubleClick={(e) => handleRowDbClick(e, row)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
        onContextMenu={(e) => handleClicks(e, row)}
        className={clsx(
          'group/tablerow w-[calc(100%-10px)] flex flex-row transition-colors',
          'hover:bg-foreground/20 data-[state=selected]:bg-foreground/30',
        )}
        style={{
          height: `${virtualRow.size}px`,
          position: 'absolute',
          top: virtualRow.start,
        }}
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
      {flexRender(columnDef.cell, cell.getContext())}
    </div>
  )
}
