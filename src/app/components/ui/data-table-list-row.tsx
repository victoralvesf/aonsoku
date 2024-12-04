import { flexRender, Row } from '@tanstack/react-table'
import clsx from 'clsx'
import { MouseEvent } from 'react'
import { ContextMenuProvider } from '@/app/components/table/context-menu'
import { ColumnDefType } from '@/types/react-table/columnDef'

interface TableRowProps<TData> {
  row: Row<TData>
  virtualRow: { index: number; size: number; start: number }
  index: number
  handleClicks: (e: MouseEvent<HTMLDivElement>, row: Row<TData>) => void
  handleRowDbClick: (e: MouseEvent<HTMLDivElement>, row: Row<TData>) => void
  getContextMenuOptions: (row: Row<TData>) => JSX.Element | undefined
}

export function TableListRow<TData>({
  row,
  virtualRow,
  index,
  handleClicks,
  handleRowDbClick,
  getContextMenuOptions,
}: TableRowProps<TData>) {
  return (
    <ContextMenuProvider options={getContextMenuOptions(row)}>
      <div
        role="row"
        data-row-index={virtualRow.index}
        data-state={row.getIsSelected() && 'selected'}
        onClick={(e) => handleClicks(e, row)}
        onDoubleClick={(e) => handleRowDbClick(e, row)}
        onContextMenu={(e) => handleClicks(e, row)}
        className={clsx(
          'group/tablerow w-full flex flex-row transition-colors',
          'hover:bg-gray-300 dark:hover:bg-gray-700',
          'data-[state=selected]:bg-gray-400/50 dark:data-[state=selected]:bg-gray-600',
        )}
        style={{
          height: `${virtualRow.size}px`,
          transform: `translateY(${virtualRow.start - index * virtualRow.size}px)`,
        }}
      >
        {row.getVisibleCells().map((cell) => {
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
        })}
      </div>
    </ContextMenuProvider>
  )
}
