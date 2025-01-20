import { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/utils'
import { tauriDragRegion } from '@/utils/tauriDragRegion'

type DragRegionProps = ComponentPropsWithoutRef<'div'>

export function DragRegion({ className, ...other }: DragRegionProps) {
  return (
    <div
      className={cn(
        'fixed top-0 inset-x-0 h-[--header-height] bg-transparent',
        className,
      )}
      {...tauriDragRegion}
      {...other}
    />
  )
}
