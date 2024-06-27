import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import clsx from 'clsx/lite'
import { XIcon } from 'lucide-react'
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  useReactTable,
  Row,
  RowData,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingFn,
} from '@tanstack/react-table'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/components/ui/table'
import { ColumnFilter } from '@/types/columnFilter'
import { DataTablePagination } from '@/app/components/ui/data-table-pagination'
import { Input } from '@/app/components/ui/input'
import { Button } from '@/app/components/ui/button'

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    handlePlaySong: ((row: Row<TData>) => void) | undefined
  }
  interface SortingFns {
    customSortFn: SortingFn<unknown>
  }
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
  onRowClick?: (row: Row<TData>) => void
  handlePlaySong?: (row: Row<TData>) => void
  columnFilter?: ColumnFilter[]
  showPagination?: boolean
  showSearch?: boolean
  searchColumn?: string
}

export function DataTable<TData, TValue>({
  columns,
  data,
  onRowClick,
  handlePlaySong,
  columnFilter,
  showPagination = false,
  showSearch = false,
  searchColumn,
}: DataTableProps<TData, TValue>) {
  const { t } = useTranslation()
  const newColumns = columns.filter((column) => {
    return columnFilter?.includes(column.id as ColumnFilter)
  })

  const [columnSearch, setColumnSearch] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])

  const table = useReactTable({
    data,
    columns: columnFilter ? newColumns : columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: showPagination ? getPaginationRowModel() : undefined,
    onColumnFiltersChange: setColumnSearch,
    getFilteredRowModel: showSearch ? getFilteredRowModel() : undefined,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    sortingFns: {
      customSortFn: (rowA, rowB, columnId) => {
        return rowA.original[columnId].localeCompare(rowB.original[columnId])
      },
    },
    meta: {
      handlePlaySong,
    },
    state: {
      columnFilters: columnSearch,
      sorting,
    },
  })

  const smallerHeaders = ['index', 'starred', 'actions']
  const hiddenHeaders = ['artist', 'playCount', 'played']

  const inputValue =
    searchColumn !== undefined
      ? (table.getColumn(searchColumn || '')?.getFilterValue() as string)
      : undefined

  return (
    <>
      {showSearch && searchColumn && (
        <div className="flex items-center mb-4">
          <div className="max-w-xs relative">
            <Input
              placeholder={t('sidebar.search')}
              value={inputValue ?? ''}
              onChange={(event) =>
                table
                  .getColumn(searchColumn)
                  ?.setFilterValue(event.target.value)
              }
              autoCorrect="false"
              autoCapitalize="false"
              spellCheck="false"
            />
            {inputValue !== '' && inputValue !== undefined && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-2 w-6 h-6"
                onClick={() =>
                  table.getColumn(searchColumn)?.setFilterValue('')
                }
              >
                <XIcon className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      )}
      <div className="rounded-md border">
        <Table className="cursor-default">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={clsx(
                        'p-2',
                        smallerHeaders.includes(header.id) && 'w-8',
                        header.id === 'albumCount' && 'w-48',
                        hiddenHeaders.includes(header.id) &&
                          'hidden 2xl:table-cell',
                      )}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                  onClick={() => onRowClick?.(row)}
                  className="group/tablerow"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      key={cell.id}
                      className={clsx(
                        'p-2 max-w-[600px]',
                        hiddenHeaders.includes(cell.column.id) &&
                          'hidden 2xl:table-cell',
                      )}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center p-2"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {showPagination && <DataTablePagination table={table} />}
    </>
  )
}
