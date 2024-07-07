import { ReactNode } from 'react'

export function ShadowHeader({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-start px-8 h-[--shadow-header-height] fixed top-[--header-height] right-0 left-[--sidebar-width] z-50 border-b bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 shadow-lg shadow-b-2 -shadow-spread-2">
      {children}
    </div>
  )
}
