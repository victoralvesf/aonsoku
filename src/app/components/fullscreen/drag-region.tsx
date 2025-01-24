import { ComponentPropsWithoutRef } from 'react'
import { Windows } from '@/app/components/controls/windows'
import { cn } from '@/lib/utils'
import { isWindows } from '@/utils/osType'
import { tauriDragRegion } from '@/utils/tauriDragRegion'

type DragRegionProps = ComponentPropsWithoutRef<'div'>

export function DragRegion({ className, ...other }: DragRegionProps) {
  return (
    <div
      className={cn(
        'fixed top-0 inset-x-0 h-[--header-height] flex items-center justify-end bg-transparent px-4',
        className,
      )}
      {...tauriDragRegion}
      {...other}
    >
      {isWindows && <Windows />}
    </div>
  )
}
