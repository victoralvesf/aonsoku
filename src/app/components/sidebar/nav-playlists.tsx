import { useQuery } from '@tanstack/react-query'
import { Home, ListMusic } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { EmptyPlaylistsMessage } from '@/app/components/playlist/empty-message'
import { SidebarPlaylistButtons } from '@/app/components/playlist/sidebar-buttons'
import {
  MainSidebarContent,
  MainSidebarGroupLabel,
  MainSidebarMenu,
  MainSidebarMenuButton,
  MainSidebarMenuItem,
} from '@/app/components/ui/main-sidebar'
import { SidebarItems } from '@/app/layout/sidebar'
import { ROUTES } from '@/routes/routesList'
import { subsonic } from '@/service/subsonic'
import { queryKeys } from '@/utils/queryKeys'
import { ScrollArea } from '../ui/scroll-area'

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
                <MainSidebarMenuItem key={playlist.id}>
                  <MainSidebarMenuButton asChild>
                    <Link to={ROUTES.PLAYLIST.PAGE(playlist.id)}>
                      <ListMusic />
                      <span className="truncate">{playlist.name}</span>
                    </Link>
                  </MainSidebarMenuButton>
                </MainSidebarMenuItem>
              ))}

            {!hasPlaylists && <EmptyPlaylistsMessage />}
          </MainSidebarMenu>
        </ScrollArea>
      </MainSidebarContent>
    </>
  )
}
