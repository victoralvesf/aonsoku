import { useEffect } from 'react'
import { Location, Outlet, useLocation } from 'react-router-dom'
import { ScrollArea } from '@/app/components/ui/scroll-area'
import { scrollPageToTop } from '@/utils/scrollPageToTop'

export function MainRoutes() {
  const { pathname } = useLocation() as Location

  useEffect(() => {
    scrollPageToTop()
  }, [pathname])

  return (
    <main className="flex h-full pl-[--mini-sidebar-width] 2xl:pl-[--sidebar-width] pt-[--header-height] pb-[--player-height]">
      <ScrollArea
        id="main-scroll-area"
        className="w-full bg-background-foreground"
      >
        <Outlet />
      </ScrollArea>
    </main>
  )
}
