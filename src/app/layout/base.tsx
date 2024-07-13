import { useEffect } from 'react'
import { Outlet, useLocation, Location } from 'react-router-dom'

import { Player } from '@/app/components/player/player'
import { ScrollArea } from '@/app/components/ui/scroll-area'
import { Header } from '@/app/layout/header'
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
      <Sidebar />
      <Player />
      {/* Routes */}
      <main className="flex h-full md:pl-0 lg:pl-[--sidebar-width] pt-[--header-height] pb-[--player-height]">
        <ScrollArea id="main-scroll-area" className="w-full bg-muted/30">
          <Outlet />
        </ScrollArea>
      </main>
    </div>
  )
}
