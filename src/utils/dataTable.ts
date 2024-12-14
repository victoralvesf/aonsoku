export function computeMultiSelectedRows(lastRow: number, rowIndex: number) {
  const start = Math.min(lastRow, rowIndex)
  const end = Math.max(lastRow, rowIndex)

  const selectedRowsUpdater: Record<number, boolean> = {}
  for (let i = start; i <= end; i++) {
    selectedRowsUpdater[i] = true
  }

  return selectedRowsUpdater
}
