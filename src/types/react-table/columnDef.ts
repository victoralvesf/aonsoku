import type { ColumnDef } from '@tanstack/react-table'
import { CSSProperties } from 'react'

export type ColumnDefType<TData, TValue = unknown> = ColumnDef<
  TData,
  TValue
> & {
  style?: CSSProperties
  className?: string
}
