import { useEffect } from 'react'
import { Outlet, useLocation, Location } from 'react-router-dom'

import { Player } from '@/app/components/player/player'
import { ScrollArea } from '@/app/components/ui/scroll-area'
import { Header } from '@/app/layout/header'
import { MiniSidebar } from '@/app/layout/mini-sidebar'
import { Sidebar } from '@/app/layout/sidebar'

export default function BaseLayout() {
  const location = useLocation() as Location

  useEffect(() => {
    document
      .querySelector('#main-scroll-area #scroll-viewport')
      ?.scrollTo({ top: 0 })
  }, [location])

  return (
    <div className="h-screen w-screen overflow-hidden">
      <Header />
      <MiniSidebar />
      <Sidebar />
      <Player />
      {/* Routes */}
      <main className="flex h-full pl-[--mini-sidebar-width] lg:pl-[--sidebar-width] pt-[--header-height] pb-[--player-height]">
        <ScrollArea
          id="main-scroll-area"
          className="w-full bg-[--main-background]"
        >
          <Outlet />
        </ScrollArea>
      </main>
    </div>
  )
}
