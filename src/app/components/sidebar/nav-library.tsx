import { Library, ListMusic, Mic2, Music2, Podcast, Radio } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import {
  MainSidebarGroup,
  MainSidebarGroupLabel,
  MainSidebarMenu,
  MainSidebarMenuButton,
  MainSidebarMenuItem,
} from '@/app/components/ui/main-sidebar'
import { SidebarItems } from '@/app/layout/sidebar'
import { ROUTES } from '@/routes/routesList'

export const libraryItems = [
  {
    id: SidebarItems.Artists,
    title: 'sidebar.artists',
    route: ROUTES.LIBRARY.ARTISTS,
    icon: Mic2,
  },
  {
    id: SidebarItems.Songs,
    title: 'sidebar.songs',
    route: ROUTES.LIBRARY.SONGS,
    icon: Music2,
  },
  {
    id: SidebarItems.Albums,
    title: 'sidebar.albums',
    route: ROUTES.LIBRARY.ALBUMS,
    icon: Library,
  },
  {
    id: SidebarItems.Playlists,
    title: 'sidebar.playlists',
    route: ROUTES.LIBRARY.PLAYLISTS,
    icon: ListMusic,
  },
  {
    id: SidebarItems.Podcasts,
    title: 'sidebar.podcasts',
    route: ROUTES.LIBRARY.PODCASTS,
    icon: Podcast,
  },
  {
    id: SidebarItems.Radios,
    title: 'sidebar.radios',
    route: ROUTES.LIBRARY.RADIOS,
    icon: Radio,
  },
]

export function NavLibrary() {
  const { t } = useTranslation()

  return (
    <MainSidebarGroup className="px-4 py-0">
      <MainSidebarGroupLabel>{t('sidebar.library')}</MainSidebarGroupLabel>
      <MainSidebarMenu>
        {libraryItems.map((item) => (
          <MainSidebarMenuItem key={item.id}>
            <MainSidebarMenuButton asChild>
              <Link to={item.route}>
                <item.icon />
                {t(item.title)}
              </Link>
            </MainSidebarMenuButton>
          </MainSidebarMenuItem>
        ))}
      </MainSidebarMenu>
    </MainSidebarGroup>
  )
}
