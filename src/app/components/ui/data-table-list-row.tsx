import { Cell, flexRender, Row } from '@tanstack/react-table'
import clsx from 'clsx'
import { DragEvent, MouseEvent, memo, TouchEvent, useMemo, useState } from 'react'
import { ContextMenuProvider } from '@/app/components/table/context-menu'
import { usePlayerActions, usePlayerCurrentSong } from '@/store/player.store'
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
  dataType?: 'song' | 'artist' | 'playlist' | 'radio'
  pageType?: 'general' | 'queue'
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
  dataType = 'song',
  pageType = 'general',
}: TableRowProps<TData>) {
  const currentSong = usePlayerCurrentSong()
  const { reorderSongInQueue } = usePlayerActions()
  const [isDragOver, setIsDragOver] = useState(false)

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

  const isRowSongActive = useMemo(() => {
    if (dataType !== 'song') return false

    // @ts-expect-error row type
    return row.original.id === currentSong.id
  }, [currentSong.id, dataType, row.original])

  const isQueue = pageType === 'queue'

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    if (!isQueue) return
    e.preventDefault()
    e.stopPropagation()
    e.dataTransfer.dropEffect = 'move'
    setIsDragOver(true)
  }

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    if (!isQueue) return
    // Only clear drag over state if we're actually leaving the row element
    const currentTarget = e.currentTarget
    const relatedTarget = e.relatedTarget as Node | null
    if (!currentTarget.contains(relatedTarget)) {
      e.preventDefault()
      e.stopPropagation()
      setIsDragOver(false)
    }
  }

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    if (!isQueue) return
    e.preventDefault()
    e.stopPropagation()
    setIsDragOver(false)

    const sourceIndexStr = e.dataTransfer.getData('text/plain')
    const sourceIndex = parseInt(sourceIndexStr, 10)
    const destinationIndex = row.index

    if (!isNaN(sourceIndex) && sourceIndex !== destinationIndex) {
      reorderSongInQueue(sourceIndex, destinationIndex)
    }
  }

  return (
    <MemoContextMenuProvider options={getContextMenuOptions(row)}>
      <div
        role="row"
        data-test-id="table-row"
        data-row-index={virtualRow.index}
        data-state={row.getIsSelected() && 'selected'}
        onClick={(e) => handleClicks(e, row)}
        onDoubleClick={(e) => handleRowDbClick(e, row)}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onTouchCancel={handleTouchCancel}
        onContextMenu={(e) => handleClicks(e, row)}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={clsx(
          'group/tablerow w-[calc(100%-10px)] flex flex-row transition-colors',
          'data-[state=selected]:bg-foreground/30 hover:bg-foreground/20',
          isQueue && 'rounded-md',
          isRowSongActive && 'row-active bg-foreground/20',
          isQueue && isDragOver && 'bg-foreground/30 border-t-2 border-primary',
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
