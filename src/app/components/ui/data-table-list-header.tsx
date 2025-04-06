import { flexRender, Header } from '@tanstack/react-table'
import clsx from 'clsx'
import { ColumnDefType } from '@/types/react-table/columnDef'

interface TableHeaderProps<TData> {
  header: Header<TData, unknown>
}

export function DataTableListHeader<TData>({
  header,
}: TableHeaderProps<TData>) {
  const columnDef = header.column.columnDef as ColumnDefType<TData>

  return (
    <div
      className={clsx(
        'p-2 h-10 flex items-center justify-start align-middle font-medium',
        'text-muted-foreground',
        '[&:has([role=checkbox])]:pr-4',
        columnDef.className,
      )}
      style={columnDef.style}
      role="columnheader"
    >
      {header.isPlaceholder
        ? null
        : flexRender(columnDef.header, header.getContext())}
    </div>
  )
}
