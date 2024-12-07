import {
  HomeIcon,
  Library,
  ListMusic,
  Mic2,
  Music2,
  Radio,
  SearchIcon,
} from 'lucide-react'
import { MiniSidebarItem } from '@/app/components/sidebar/mini-item'
import { MiniSidebarSearch } from '@/app/components/sidebar/mini-search'
import { ROUTES } from '@/routes/routesList'

export function MiniSidebar() {
  return (
    <aside className="flex 2xl:hidden flex-col items-center justify-start gap-1 min-w-[--mini-sidebar-width] max-w-[--mini-sidebar-width] border-r fixed top-[--header-height] left-0 bottom-0 pb-[--player-height] bg-background z-10 p-2">
      <MiniSidebarSearch title={searchItem.title} icon={searchItem.icon} />

      {menuItems.map((item) => (
        <MiniSidebarItem item={item} key={item.route} />
      ))}
    </aside>
  )
}

const iconClassName = 'h-4 w-4'

const menuItems = [
  {
    title: 'sidebar.home',
    route: ROUTES.LIBRARY.HOME,
    icon: <HomeIcon className={iconClassName} />,
  },
  {
    title: 'sidebar.artists',
    route: ROUTES.LIBRARY.ARTISTS,
    icon: <Mic2 className={iconClassName} />,
  },
  {
    title: 'sidebar.songs',
    route: ROUTES.LIBRARY.SONGS,
    icon: <Music2 className={iconClassName} />,
  },
  {
    title: 'sidebar.albums',
    route: ROUTES.LIBRARY.ALBUMS,
    icon: <Library className={iconClassName} />,
  },
  {
    title: 'sidebar.playlists',
    route: ROUTES.LIBRARY.PLAYLISTS,
    icon: <ListMusic className={iconClassName} />,
  },
  {
    title: 'sidebar.radios',
    route: ROUTES.LIBRARY.RADIOS,
    icon: <Radio className={iconClassName} />,
  },
]

const searchItem = {
  title: 'sidebar.miniSearch',
  icon: <SearchIcon className={iconClassName} />,
}
