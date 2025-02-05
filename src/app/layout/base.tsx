import { memo } from 'react'
import { Player } from '@/app/components/player/player'
import { RemovePlaylistDialog } from '@/app/components/playlist/remove-dialog'
import { SongInfoModal } from '@/app/components/song/info-modal'
import { Header } from '@/app/layout/header'
import { MiniSidebar } from '@/app/layout/mini-sidebar'
import { Sidebar } from '@/app/layout/sidebar'
import { MainRoutes } from './main'

const HeaderMemo = memo(Header)
const MiniSidebarMemo = memo(MiniSidebar)
const SidebarMemo = memo(Sidebar)
const PlayerMemo = memo(Player)

export default function BaseLayout() {
  return (
    <div className="h-screen w-screen overflow-hidden">
      <HeaderMemo />
      <MiniSidebarMemo />
      <SidebarMemo />
      <PlayerMemo />
      {/* Routes */}
      <MainRoutes />
      <SongInfoModal />
      <RemovePlaylistDialog />
    </div>
  )
}
