import { memo } from 'react'
import { MainDrawerPage } from '@/app/components/drawer/page'
import { Player } from '@/app/components/player/player'
import { RemovePlaylistDialog } from '@/app/components/playlist/remove-dialog'
import { SongInfoDialog } from '@/app/components/song/info-dialog'
import { Header } from '@/app/layout/header'
import { MiniSidebar } from '@/app/layout/mini-sidebar'
import { Sidebar } from '@/app/layout/sidebar'
import { MainRoutes } from './main'

const HeaderMemo = memo(Header)
const MiniSidebarMemo = memo(MiniSidebar)
const SidebarMemo = memo(Sidebar)
const PlayerMemo = memo(Player)
const MemoMainDrawerPage = memo(MainDrawerPage)

export default function BaseLayout() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <HeaderMemo />
      <MiniSidebarMemo />
      <SidebarMemo />
      <PlayerMemo />
      {/* Routes */}
      <MainRoutes />
      <SongInfoDialog />
      <RemovePlaylistDialog />
      <MemoMainDrawerPage />
    </div>
  )
}
