import { ListMusic, Mic2, Music2, Radio, Home, Library } from 'lucide-react'
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

export function Sidebar({ className }: SidebarProps) {
  const { t } = useTranslation()

  return (
    <aside>
      <div
        className={cn(
          'hidden lg:flex flex-col min-w-[--sidebar-width] max-w-[--sidebar-width] border-r fixed top-[--header-height] left-0 bottom-0 pb-[--player-height] bg-background z-10',
          className,
        )}
      >
        <div className="p-4">
          <CommandMenu />
        </div>
        <div className="space-y-4 py-4 pt-0 min-w-[275px] max-w-[275px]">
          <SidebarSection>
            <div className="space-y-1">
              <SidebarGenerator list={mainMenuItems} />
            </div>
          </SidebarSection>
          <SidebarSection>
            <SectionTitle>{t('sidebar.library')}</SectionTitle>
            <div className="space-y-1">
              <SidebarGenerator list={libraryItems} />
            </div>
          </SidebarSection>
        </div>

        <SidebarPlaylists />
      </div>

      <CreatePlaylistDialog />
    </aside>
  )
}

const iconClassName = 'mr-2 h-4 w-4'

const mainMenuItems = [
  {
    title: 'sidebar.home',
    route: ROUTES.LIBRARY.HOME,
    icon: <Home className={iconClassName} />,
  },
]

const libraryItems = [
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
