import { memo, useEffect } from 'react'
import { Outlet, useLocation, Location } from 'react-router-dom'

import { Player } from '@/app/components/player/player'
import { SongInfoModal } from '@/app/components/song/info-modal'
import { ScrollArea } from '@/app/components/ui/scroll-area'
import { Header } from '@/app/layout/header'
import { MiniSidebar } from '@/app/layout/mini-sidebar'
import { Sidebar } from '@/app/layout/sidebar'
import { scrollPageToTop } from '@/utils/scrollPageToTop'

const HeaderMemo = memo(Header)
const MiniSidebarMemo = memo(MiniSidebar)
const SidebarMemo = memo(Sidebar)
const PlayerMemo = memo(Player)

export default function BaseLayout() {
  const { pathname } = useLocation() as Location

  useEffect(() => {
    scrollPageToTop()
  }, [pathname])

  return (
    <div className="h-screen w-screen overflow-hidden">
      <HeaderMemo />
      <MiniSidebarMemo />
      <SidebarMemo />
      <PlayerMemo />
      {/* Routes */}
      <main className="flex h-full pl-[--mini-sidebar-width] lg:pl-[--sidebar-width] pt-[--header-height] pb-[--player-height]">
        <ScrollArea
          id="main-scroll-area"
          className="w-full bg-background-foreground"
        >
          <Outlet />
        </ScrollArea>
      </main>
      <SongInfoModal />
    </div>
  )
}
