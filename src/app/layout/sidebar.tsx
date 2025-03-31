import {
  ListMusicIcon,
  Mic2Icon,
  Music2Icon,
  RadioIcon,
  HomeIcon,
  LibraryIcon,
  PodcastIcon,
} from 'lucide-react'
import { memo } from 'react'
import { useTranslation } from 'react-i18next'

import CommandMenu from '@/app/components/command/command-menu'
import { CreatePlaylistDialog } from '@/app/components/playlist/form-dialog'
import {
  SectionTitle,
  SidebarPlaylists,
  SidebarSection,
} from '@/app/components/playlist/sidebar-list'
import { SidebarGenerator } from '@/app/components/sidebar/sidebar-generator'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/routes/routesList'

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

const ListMusic = memo(ListMusicIcon)
const Mic2 = memo(Mic2Icon)
const Music2 = memo(Music2Icon)
const Radio = memo(RadioIcon)
const Home = memo(HomeIcon)
const Library = memo(LibraryIcon)
const Podcast = memo(PodcastIcon)

const MemoSidebarGenerator = memo(SidebarGenerator)
const MemoCommandMenu = memo(CommandMenu)

export function Sidebar({ className }: SidebarProps) {
  const { t } = useTranslation()

  return (
    <aside>
      <div
        className={cn(
          'hidden 2xl:flex flex-col min-w-sidebar max-w-sidebar border-r fixed top-header left-0 bottom-0 pb-player bg-background z-10',
          className,
        )}
      >
        <div className="p-4">
          <MemoCommandMenu />
        </div>
        <div className="space-y-4 py-4 pt-0">
          <SidebarSection>
            <div>
              <MemoSidebarGenerator list={mainMenuItems} />
            </div>
          </SidebarSection>
          <SidebarSection>
            <SectionTitle>{t('sidebar.library')}</SectionTitle>
            <div>
              <MemoSidebarGenerator list={libraryItems} />
            </div>
          </SidebarSection>
        </div>

        <SidebarPlaylists />
      </div>

      <CreatePlaylistDialog />
    </aside>
  )
}

export enum SidebarItems {
  Home = 'home',
  Artists = 'artists',
  Songs = 'songs',
  Albums = 'albums',
  Playlists = 'playlists',
  Podcasts = 'podcasts',
  Radios = 'radios',
}

export const mainMenuItems = [
  {
    id: SidebarItems.Home,
    title: 'sidebar.home',
    route: ROUTES.LIBRARY.HOME,
    icon: Home,
  },
]

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
