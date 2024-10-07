import {
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
import clsx from 'clsx'
import { Disc2Icon, XIcon } from 'lucide-react'
import { Fragment, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/app/components/ui/button'
import { DataTablePagination } from '@/app/components/ui/data-table-pagination'
import { Input } from '@/app/components/ui/input'
import { usePlayerSonglist } from '@/store/player.store'
import { ColumnFilter } from '@/types/columnFilter'
import { ColumnDefType } from '@/types/react-table/columnDef'

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    handlePlaySong: ((row: Row<TData>) => void) | undefined
  }
  interface SortingFns {
    customSortFn: SortingFn<unknown>
  }
}

type DiscNumber = {
  discNumber: number
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDefType<TData, TValue>[]
  data: TData[]
  handlePlaySong?: (row: Row<TData>) => void
  columnFilter?: ColumnFilter[]
  showPagination?: boolean
  showSearch?: boolean
  searchColumn?: string
  noRowsMessage?: string
  allowRowSelection?: boolean
  showHeader?: boolean
  showDiscNumber?: boolean
  variant?: 'classic' | 'modern'
}

export function DataTable<TData, TValue>({
  columns,
  data,
  handlePlaySong,
  columnFilter,
  showPagination = false,
  showSearch = false,
  searchColumn,
  noRowsMessage = 'No results.',
  allowRowSelection = true,
  showHeader = true,
  showDiscNumber = false,
  variant = 'classic',
}: DataTableProps<TData, TValue>) {
  const { t } = useTranslation()
  const newColumns = columns.filter((column) => {
    return columnFilter?.includes(column.id as ColumnFilter)
  })
  const { currentSong } = usePlayerSonglist()

  const [columnSearch, setColumnSearch] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState({})

  const table = useReactTable({
    data,
    columns: columnFilter ? newColumns : columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: showPagination ? getPaginationRowModel() : undefined,
    onColumnFiltersChange: setColumnSearch,
    getFilteredRowModel: showSearch ? getFilteredRowModel() : undefined,
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onRowSelectionChange: setRowSelection,
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
      rowSelection,
    },
  })

  const inputValue =
    searchColumn !== undefined
      ? (table.getColumn(searchColumn || '')?.getFilterValue() as string)
      : undefined

  function getDiscIndexes() {
    if (!showDiscNumber) return []

    const uniqueIndices: number[] = []
    const seen = new Set<number>()

    table.getRowModel().rows.forEach(({ original }, index) => {
      const item = original as DiscNumber
      if (!('discNumber' in item)) return

      if (!seen.has(item.discNumber)) {
        seen.add(item.discNumber)
        uniqueIndices.push(index)
      }
    })

    return uniqueIndices
  }

  const discNumberIndexes = getDiscIndexes()

  function rowIsPlaying(row: Row<TData>) {
    // @ts-expect-error row.original can't be typed
    const id = row.original && row.original.id ? row.original.id : ''

    if (id === '' || !currentSong) {
      return false
    }

    return id === currentSong.id
  }

  const isClassic = variant === 'classic'
  const isModern = variant === 'modern'

  const selectedRows = Object.keys(rowSelection).map(Number)
  const isRowSelected = (rowIndex: number) => selectedRows.includes(rowIndex)
  const isPrevRowSelected = (rowIndex: number) => isRowSelected(rowIndex - 1)
  const isNextRowSelected = (rowIndex: number) => isRowSelected(rowIndex + 1)

  return (
    <>
      {showSearch && searchColumn && (
        <div className="flex items-center mb-4" data-testid="table-search">
          <div className="w-72 relative">
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

      <div className={clsx(isClassic && 'rounded-md border')}>
        <div
          className={clsx(
            'relative w-full overflow-hidden rounded-md cursor-default caption-bottom text-sm',
            isClassic ? 'bg-background' : 'bg-transparent',
          )}
          data-testid="data-table"
          role="table"
        >
          {showHeader && (
            <div>
              {table.getHeaderGroups().map((headerGroup) => (
                <div
                  key={headerGroup.id}
                  className={clsx(
                    'w-full flex flex-row border-b',
                    isModern && 'mb-2 border-foreground/20',
                  )}
                  role="row"
                >
                  {headerGroup.headers.map((header) => {
                    const columnDef = header.column
                      .columnDef as ColumnDefType<TData>

                    return (
                      <div
                        key={header.id}
                        className={clsx(
                          'p-2 h-12 flex items-center justify-start align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-4',
                          columnDef.className,
                        )}
                        style={columnDef.style}
                        role="columnheader"
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                      </div>
                    )
                  })}
                </div>
              ))}
            </div>
          )}
          <div className="[&_div:last-child]:border-0">
            <div className="w-full h-full overflow-hidden">
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row, index) => (
                  <Fragment key={row.id}>
                    {showDiscNumber && discNumberIndexes.includes(index) && (
                      <div
                        className={clsx(
                          'w-full h-14 flex flex-row items-center transition-colors text-muted-foreground',
                          isClassic && 'border-b',
                        )}
                        role="row"
                      >
                        <div className="w-12 flex items-center justify-center">
                          <Disc2Icon strokeWidth={1.75} />
                        </div>
                        <span className="font-medium ml-[7px]">
                          {t('album.table.discNumber', {
                            number: (row.original as DiscNumber).discNumber,
                          })}
                        </span>
                      </div>
                    )}
                    <div
                      data-state={row.getIsSelected() && 'selected'}
                      onClick={() => {
                        allowRowSelection && row.toggleSelected()
                      }}
                      className={clsx(
                        'group/tablerow w-full flex flex-row transition-colors',
                        isClassic &&
                          'border-b hover:bg-muted/50 data-[state=selected]:bg-muted',
                        isModern && [
                          'hover:bg-gray-300/80 dark:hover:bg-gray-700',
                          'data-[state=selected]:bg-gray-400/50 dark:data-[state=selected]:bg-gray-700',
                        ],
                        isModern &&
                          !table.getIsSomeRowsSelected() &&
                          !table.getIsAllRowsSelected() &&
                          rowIsPlaying(row) &&
                          'rounded-md bg-gray-400/50 dark:bg-gray-700',
                        isModern && !row.getIsSelected() && 'rounded-md',
                        isModern &&
                          row.getIsSelected() &&
                          !isPrevRowSelected(index) &&
                          'rounded-t-md',
                        isModern &&
                          row.getIsSelected() &&
                          !isNextRowSelected(index) &&
                          'rounded-b-md',
                      )}
                      role="row"
                    >
                      {row.getVisibleCells().map((cell) => {
                        const columnDef = cell.column
                          .columnDef as ColumnDefType<TData>

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
                            {flexRender(
                              cell.column.columnDef.cell,
                              cell.getContext(),
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </Fragment>
                ))
              ) : (
                <div role="row">
                  <div
                    className="flex h-24 items-center justify-center p-2"
                    role="cell"
                  >
                    {noRowsMessage}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {showPagination && <DataTablePagination table={table} />}
    </>
  )
}
