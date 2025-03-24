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
  Table,
} from '@tanstack/react-table'
import clsx from 'clsx'
import { Disc2Icon, XIcon } from 'lucide-react'
import {
  Fragment,
  memo,
  MouseEvent,
  TouchEvent,
  useCallback,
  useMemo,
  useState,
} from 'react'
import { isMacOs } from 'react-device-detect'
import { useHotkeys } from 'react-hotkeys-hook'
import { useTranslation } from 'react-i18next'

import { PlaylistOptions } from '@/app/components/playlist/options'
import { SongMenuOptions } from '@/app/components/song/menu-options'
import { SelectedSongsMenuOptions } from '@/app/components/song/selected-options'
import { Button } from '@/app/components/ui/button'
import { DataTablePagination } from '@/app/components/ui/data-table-pagination'
import { Input } from '@/app/components/ui/input'
import { ColumnFilter } from '@/types/columnFilter'
import { ColumnDefType } from '@/types/react-table/columnDef'
import { Playlist } from '@/types/responses/playlist'
import { ISong } from '@/types/responses/song'
import { MouseButton } from '@/utils/browser'
import { computeMultiSelectedRows } from '@/utils/dataTable'
import { TableRow } from './data-table-row'

const MemoTableRow = memo(TableRow) as typeof TableRow

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
  showContextMenu?: boolean
  showHeader?: boolean
  showDiscNumber?: boolean
  variant?: 'classic' | 'modern'
  dataType?: 'song' | 'artist' | 'playlist' | 'radio'
}

let isTap = false
let tapTimeout: NodeJS.Timeout

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
  showContextMenu = true,
  showHeader = true,
  showDiscNumber = false,
  variant = 'classic',
  dataType = 'song',
}: DataTableProps<TData, TValue>) {
  const { t } = useTranslation()
  const newColumns = columns.filter((column) => {
    return columnFilter?.includes(column.id as ColumnFilter)
  })

  const [columnSearch, setColumnSearch] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [lastRowSelected, setLastRowSelected] = useState<number | null>(null)

  const isClassic = variant === 'classic'
  const isModern = variant === 'modern'

  const selectedRows = useMemo(
    () => Object.keys(rowSelection).map(Number),
    [rowSelection],
  )
  const isRowSelected = useCallback(
    (rowIndex: number) => selectedRows.includes(rowIndex),
    [selectedRows],
  )
  const isPrevRowSelected = useCallback(
    (rowIndex: number) => isRowSelected(rowIndex - 1),
    [isRowSelected],
  )
  const isNextRowSelected = useCallback(
    (rowIndex: number) => isRowSelected(rowIndex + 1),
    [isRowSelected],
  )

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
    enableSorting: true,
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

  const { rows } = table.getRowModel()

  const selectAllShortcut = useCallback(
    (state = true) => {
      if (allowRowSelection) {
        table.toggleAllRowsSelected(state)
      }
    },
    [allowRowSelection, table],
  )

  useHotkeys('mod+a', () => selectAllShortcut(), {
    preventDefault: true,
    enabled: !table.getIsAllRowsSelected(),
  })

  useHotkeys('esc', () => selectAllShortcut(false), {
    preventDefault: true,
    enabled: table.getIsAllRowsSelected() || table.getIsSomeRowsSelected(),
  })

  const inputValue =
    searchColumn !== undefined
      ? (table.getColumn(searchColumn || '')?.getFilterValue() as string)
      : undefined

  const getDiscIndexes = useCallback(() => {
    if (!showDiscNumber) return []

    const uniqueIndices: number[] = []
    const seen = new Set<number>()

    rows.forEach(({ original }, index) => {
      const item = original as DiscNumber
      if (!('discNumber' in item)) return

      if (!seen.has(item.discNumber)) {
        seen.add(item.discNumber)
        uniqueIndices.push(index)
      }
    })

    return uniqueIndices
  }, [rows, showDiscNumber])

  const discNumberIndexes = getDiscIndexes()

  const getContextMenuOptions = useCallback(
    (row: Row<TData>) => {
      if (!showContextMenu) return undefined

      if (dataType === 'song') {
        if (table.getIsSomeRowsSelected() || table.getIsAllRowsSelected()) {
          return (
            <SelectedSongsMenuOptions
              table={table as unknown as Table<ISong>}
            />
          )
        } else {
          return (
            <SongMenuOptions
              variant="context"
              index={row.index}
              song={row.original as ISong}
            />
          )
        }
      }

      if (dataType === 'playlist') {
        return (
          <PlaylistOptions
            variant="context"
            playlist={row.original as Playlist}
            showPlay={true}
          />
        )
      }

      return undefined
    },
    [dataType, showContextMenu, table],
  )

  const handleLeftClick = useCallback(
    (e: MouseEvent<HTMLDivElement>, row: Row<TData>) => {
      if (!allowRowSelection) return

      // Check the correct key depending on the OS (Meta for macOS, Ctrl for others)
      const isMultiSelectKey = isMacOs ? e.metaKey : e.ctrlKey

      if (isMultiSelectKey) {
        row.toggleSelected()
        setLastRowSelected(row.index)
        return
      }

      if (e.shiftKey && lastRowSelected !== null) {
        const selectedRowsUpdater = computeMultiSelectedRows(
          lastRowSelected,
          row.index,
        )
        table.setRowSelection(selectedRowsUpdater)
        return
      }

      // Deselect all rows, except current one
      table.setRowSelection({
        [row.index]: true,
      })
      setLastRowSelected(row.index)
    },
    [allowRowSelection, lastRowSelected, table],
  )

  const handleRightClick = useCallback(
    (row: Row<TData>) => {
      if (!allowRowSelection) return

      const hasSelectedRows = selectedRows.length > 0
      const isSelected = isRowSelected(row.index)

      if (hasSelectedRows && !isSelected) {
        table.resetRowSelection()
      }

      row.toggleSelected(true)
      setLastRowSelected(row.index)
    },
    [allowRowSelection, isRowSelected, selectedRows.length, table],
  )

  const handleClicks = useCallback(
    (e: MouseEvent<HTMLDivElement>, row: Row<TData>) => {
      if (e.nativeEvent.button === MouseButton.Left) {
        handleLeftClick(e, row)
      }
      if (e.nativeEvent.button === MouseButton.Right) {
        handleRightClick(row)
      }
    },
    [handleLeftClick, handleRightClick],
  )

  const handleRowDbClick = useCallback(
    (e: MouseEvent<HTMLDivElement>, row: Row<TData>) => {
      if (handlePlaySong) {
        e.stopPropagation()
        handlePlaySong(row)
      }
    },
    [handlePlaySong],
  )

  const handleRowTap = useCallback(
    (e: TouchEvent<HTMLDivElement>, row: Row<TData>) => {
      clearTimeout(tapTimeout)
      if (isTap && handlePlaySong) {
        e.stopPropagation()
        handlePlaySong(row)
      }
    },
    [handlePlaySong],
  )

  function handleTouchStart() {
    isTap = true
    tapTimeout = setTimeout(() => {
      isTap = false
    }, 500)
  }

  function handleTouchMove() {
    isTap = false
  }

  function handleTouchCancel() {
    clearTimeout(tapTimeout)
    isTap = false
  }

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
              {rows?.length ? (
                rows.map((row, index) => (
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
                    <MemoTableRow
                      index={index}
                      row={row}
                      contextMenuOptions={getContextMenuOptions(row)}
                      isPrevRowSelected={isPrevRowSelected}
                      isNextRowSelected={isNextRowSelected}
                      variant={variant}
                      dataType={dataType}
                      onClick={(e) => handleClicks(e, row)}
                      onDoubleClick={(e) => handleRowDbClick(e, row)}
                      onTouchStart={handleTouchStart}
                      onTouchMove={handleTouchMove}
                      onTouchEnd={(e) => handleRowTap(e, row)}
                      onTouchCancel={handleTouchCancel}
                      onContextMenu={(e) => handleClicks(e, row)}
                    />
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
