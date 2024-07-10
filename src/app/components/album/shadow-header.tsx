import { ReactNode } from 'react'
import { Skeleton } from '../ui/skeleton'

export function ShadowHeader({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-start px-8 h-[--shadow-header-height] fixed top-[--header-height] right-0 left-[--sidebar-width] z-50 border-b bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-lg shadow-b-2 -shadow-spread-2">
      {children}
    </div>
  )
}

export function ShadowHeaderFallback() {
  return (
    <div className="flex items-center justify-start px-8 h-[--shadow-header-height] border-b shadow-lg shadow-b-2 -shadow-spread-2">
      <Skeleton className="w-28 h-8" />
      <Skeleton className="w-11 h-[22px] ml-2" />
    </div>
  )
}
