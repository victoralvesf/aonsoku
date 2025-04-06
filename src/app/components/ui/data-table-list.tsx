import {
  ColumnFiltersState,
  SortingState,
  getCoreRowModel,
  useReactTable,
  Row,
  RowData,
  getSortedRowModel,
  SortingFn,
  Table,
} from '@tanstack/react-table'
import { useVirtualizer } from '@tanstack/react-virtual'
import clsx from 'clsx'
import debounce from 'lodash/debounce'
import {
  useEffect,
  MouseEvent,
  TouchEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
  memo,
} from 'react'
import { isMacOs } from 'react-device-detect'
import { useHotkeys } from 'react-hotkeys-hook'
import { SongMenuOptions } from '@/app/components/song/menu-options'
import { SelectedSongsMenuOptions } from '@/app/components/song/selected-options'
import { ColumnFilter } from '@/types/columnFilter'
import { ColumnDefType } from '@/types/react-table/columnDef'
import { ISong } from '@/types/responses/song'
import { MouseButton } from '@/utils/browser'
import { computeMultiSelectedRows } from '@/utils/dataTable'
import { DataTableListHeader } from './data-table-list-header'
import { TableListRow } from './data-table-list-row'
import { ScrollArea, scrollAreaViewportSelector } from './scroll-area'

const MemoTableListRow = memo(TableListRow) as typeof TableListRow
const MemoDataTableListHeader = memo(
  DataTableListHeader,
) as typeof DataTableListHeader

declare module '@tanstack/react-table' {
  interface TableMeta<TData extends RowData> {
    handlePlaySong: ((row: Row<TData>) => void) | undefined
  }
  interface SortingFns {
    customSortFn: SortingFn<unknown>
  }
}

interface DataTableProps<TData, TValue> {
  columns: ColumnDefType<TData, TValue>[]
  data: TData[]
  handlePlaySong?: (row: Row<TData>) => void
  columnFilter?: ColumnFilter[]
  noRowsMessage?: string
  showHeader?: boolean
  allowRowSelection?: boolean
  showContextMenu?: boolean
  dataType?: 'song' | 'artist' | 'playlist' | 'radio'
  pageType?: 'general' | 'queue'
  fetchNextPage?: () => void
  hasNextPage?: boolean
  scrollToIndex?: boolean
  currentSongIndex?: number
}

export function DataTableList<TData, TValue>({
  columns,
  data,
  handlePlaySong,
  columnFilter,
  noRowsMessage = 'No results.',
  showHeader = true,
  allowRowSelection = true,
  showContextMenu = true,
  dataType = 'song',
  pageType = 'general',
  fetchNextPage,
  hasNextPage,
  scrollToIndex = false,
  currentSongIndex,
}: DataTableProps<TData, TValue>) {
  const newColumns = columns.filter((column) => {
    return columnFilter?.includes(column.id as ColumnFilter)
  })

  const [columnSearch, setColumnSearch] = useState<ColumnFiltersState>([])
  const [sorting, setSorting] = useState<SortingState>([])
  const [rowSelection, setRowSelection] = useState({})
  const [lastRowSelected, setLastRowSelected] = useState<number | null>(null)

  const selectedRows = useMemo(
    () => Object.keys(rowSelection).map(Number),
    [rowSelection],
  )
  const isRowSelected = useCallback(
    (rowIndex: number) => selectedRows.includes(rowIndex),
    [selectedRows],
  )

  const tableConfig = useMemo(
    () => ({
      data,
      columns: columnFilter ? newColumns : columns,
      getCoreRowModel: getCoreRowModel(),
      onColumnFiltersChange: setColumnSearch,
      onSortingChange: setSorting,
      getSortedRowModel: getSortedRowModel(),
      onRowSelectionChange: setRowSelection,
      enableSorting: false,
      sortingFns: {
        customSortFn: <T extends { original: Record<string, string> }>(
          rowA: T,
          rowB: T,
          columnId: string,
        ) => {
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
    }),
    [
      data,
      columns,
      newColumns,
      columnFilter,
      handlePlaySong,
      columnSearch,
      sorting,
      rowSelection,
    ],
  )

  const table = useReactTable(tableConfig)

  const { rows } = table.getRowModel()

  const parentRef = useRef<HTMLDivElement>(null)

  const getScrollElement = () => {
    if (!parentRef.current) return null

    return parentRef.current.querySelector(scrollAreaViewportSelector)
  }

  const estimateSize = useCallback(() => 56, [])

  const virtualizer = useVirtualizer({
    count: rows.length,
    getScrollElement,
    estimateSize,
    overscan: 5,
  })

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
      if (!handlePlaySong) return
      e.stopPropagation()
      handlePlaySong(row)
    },
    [handlePlaySong],
  )

  const handleRowTap = useCallback(
    (e: TouchEvent<HTMLDivElement>, row: Row<TData>) => {
      if (!handlePlaySong) return
      e.stopPropagation()
      handlePlaySong(row)
    },
    [handlePlaySong],
  )

  const handleScroll = useCallback(() => {
    if (!virtualizer.scrollElement || !hasNextPage || !fetchNextPage) return

    const { scrollTop, clientHeight, scrollHeight } = virtualizer.scrollElement

    const scrollThreshold = scrollHeight - scrollHeight / 8
    const isNearBottom = scrollTop + clientHeight >= scrollThreshold

    if (isNearBottom) {
      fetchNextPage()
    }
  }, [fetchNextPage, hasNextPage, virtualizer.scrollElement])

  const debouncedHandleScroll = useMemo(
    () => debounce(handleScroll, 200),
    [handleScroll],
  )

  useEffect(() => {
    if (!virtualizer.scrollElement) return

    const scrollElement = virtualizer.scrollElement

    scrollElement.addEventListener('scroll', debouncedHandleScroll)
    return () => {
      scrollElement.removeEventListener('scroll', debouncedHandleScroll)
    }
  }, [virtualizer.scrollElement, debouncedHandleScroll])

  useEffect(() => {
    if (!scrollToIndex || !currentSongIndex) return

    virtualizer.scrollToIndex(currentSongIndex, {
      align: 'start',
    })
  }, [currentSongIndex, scrollToIndex, virtualizer])

  return (
    <div className="h-full">
      <div
        className="relative w-full h-full overflow-hidden cursor-default caption-bottom text-sm bg-transparent"
        data-testid="data-table"
        role="table"
      >
        <div className={clsx(!showHeader && 'hidden')}>
          {table.getHeaderGroups().map((headerGroup) => (
            <div
              key={headerGroup.id}
              className="w-full flex flex-row border-b pr-[10px] bg-muted"
              role="row"
            >
              {headerGroup.headers.map((header) => (
                <MemoDataTableListHeader key={header.id} header={header} />
              ))}
            </div>
          ))}
        </div>
        <ScrollArea
          ref={parentRef}
          type="always"
          className={clsx(
            '[&_div:last-child]:border-0 overflow-auto',
            showHeader ? 'h-[calc(100%-41px)]' : 'h-full',
          )}
          thumbClassName={clsx(pageType === 'queue' && 'secondary-thumb-bar')}
        >
          <div
            className="w-full relative"
            style={{ height: `${virtualizer.getTotalSize()}px` }}
          >
            {virtualizer.getVirtualItems().length ? (
              virtualizer.getVirtualItems().map((virtualRow) => {
                const row = rows[virtualRow.index]

                return (
                  <MemoTableListRow
                    key={row.id}
                    row={row}
                    virtualRow={virtualRow}
                    handleClicks={handleClicks}
                    handleRowDbClick={handleRowDbClick}
                    handleRowTap={handleRowTap}
                    getContextMenuOptions={getContextMenuOptions}
                    dataType={dataType}
                    pageType={pageType}
                  />
                )
              })
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
        </ScrollArea>
      </div>
    </div>
  )
}
