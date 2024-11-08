import { Column, Table } from '@tanstack/react-table'
import {
  ChevronDownIcon,
  ChevronUpIcon,
  ChevronsUpDownIcon,
} from 'lucide-react'
import { HTMLAttributes, useCallback } from 'react'
import { Button } from '@/app/components/ui/button'
import { cn } from '@/lib/utils'

interface DataTableColumnHeaderProps<TData, TValue>
  extends HTMLAttributes<HTMLDivElement> {
  column: Column<TData, TValue>
  table: Table<TData>
}

export function DataTableColumnHeader<TData, TValue>({
  column,
  children,
  className,
  table,
}: DataTableColumnHeaderProps<TData, TValue>) {
  const handleFilter = useCallback(() => {
    if (!column.getCanSort()) return

    // If has no sort, set to asc
    if (!column.getIsSorted()) {
      column.toggleSorting(false)
    }
    // If current sort is asc, set to desc
    if (column.getIsSorted() === 'asc') {
      column.toggleSorting(true)
    }
    // If current sort is desc, reset sort state
    if (column.getIsSorted() === 'desc') {
      column.clearSorting()
    }
  }, [column])

  const getFilterIcon = useCallback(() => {
    if (!column.getCanSort()) return

    const className = 'h-4 w-4'

    if (column.getIsSorted() === 'desc') {
      return <ChevronDownIcon className={className} />
    } else if (column.getIsSorted() === 'asc') {
      return <ChevronUpIcon className={className} />
    } else {
      return <ChevronsUpDownIcon className={className} />
    }
  }, [column])

  if (!column.getCanSort() || !table.options.enableSorting) {
    return <div className={cn(className)}>{children}</div>
  }

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Button
        variant="ghost"
        size="sm"
        className="px-0 h-8 group hover:bg-transparent transition-all duration-150"
        onClick={handleFilter}
      >
        {typeof children === 'string' ? (
          <span className="group-hover:underline">{children}</span>
        ) : (
          <>{children}</>
        )}
        <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 ml-1">
          {getFilterIcon()}
        </div>
      </Button>
    </div>
  )
}
