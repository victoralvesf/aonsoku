import { useQuery } from '@tanstack/react-query'
import { Home } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { EmptyPlaylistsMessage } from '@/app/components/playlist/empty-message'
import { SidebarPlaylistButtons } from '@/app/components/playlist/sidebar-buttons'
import {
  MainSidebarContent,
  MainSidebarGroupLabel,
  MainSidebarMenu,
} from '@/app/components/ui/main-sidebar'
import { ScrollArea } from '@/app/components/ui/scroll-area'
import { SidebarItems } from '@/app/layout/sidebar'
import { ROUTES } from '@/routes/routesList'
import { subsonic } from '@/service/subsonic'
import { queryKeys } from '@/utils/queryKeys'
import { SidebarPlaylistItem } from './playlist-item'

export const mainNavItems = [
  {
    id: SidebarItems.Home,
    title: 'sidebar.home',
    route: ROUTES.LIBRARY.HOME,
    icon: Home,
  },
]

export function NavPlaylists() {
  const { t } = useTranslation()

  const { data: playlists } = useQuery({
    queryKey: [queryKeys.playlist.all],
    queryFn: subsonic.playlists.getAll,
  })

  const hasPlaylists = playlists !== undefined && playlists.length > 0

  return (
    <>
      <div className="flex items-center justify-between px-4 mt-4 overflow-x-clip transition-opacity group-data-[collapsible=icon]:opacity-0">
        <MainSidebarGroupLabel>{t('sidebar.playlists')}</MainSidebarGroupLabel>

        <SidebarPlaylistButtons />
      </div>
      <MainSidebarContent className="flex pl-4 h-full overflow-x-clip transition-[margin,opacity] group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0">
        <ScrollArea className="pb-4">
          <MainSidebarMenu className="pr-4">
            {hasPlaylists &&
              playlists.map((playlist) => (
                <SidebarPlaylistItem key={playlist.id} playlist={playlist} />
              ))}

            {!hasPlaylists && <EmptyPlaylistsMessage />}
          </MainSidebarMenu>
        </ScrollArea>
      </MainSidebarContent>
    </>
  )
}
