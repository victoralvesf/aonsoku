import { ReactNode } from 'react'

export function ShadowHeader({ children }: { children: ReactNode }) {
  return (
    <div className="flex items-center justify-start px-8 h-[--shadow-header-height] fixed top-[--header-height] right-0 left-[--mini-sidebar-width] lg:left-[--sidebar-width] z-30 border-b bg-background backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      {children}
    </div>
  )
}
