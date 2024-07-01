import { ListMusic, Mic2, Music2, Radio, Home, Library } from 'lucide-react'
import { Fragment, ReactNode, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import CommandMenu from '@/app/components/command/command-menu'
import { CreatePlaylistDialog } from '@/app/components/playlist/form-dialog'
import { PlaylistOptionsButtons } from '@/app/components/playlist/options-buttons'
import {
  SidebarGenerator,
  SidebarPlaylistGenerator,
} from '@/app/components/sidebar-generator'
import { ScrollArea } from '@/app/components/ui/scroll-area'
import { usePlaylists } from '@/app/contexts/playlists-context'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/routes/routesList'

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {}

export function Sidebar({ className }: SidebarProps) {
  const { t } = useTranslation()
  const { playlists, fetchPlaylists } = usePlaylists()

  useEffect(() => {
    fetchPlaylists()
  }, [fetchPlaylists])

  return (
    <Fragment>
      <div className={cn(className)}>
        <ScrollArea className="h-full">
          <div className="flex flex-col gap-2 px-4 sticky top-0 py-4 z-50 bg-background">
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
            <SidebarSection>
              <SectionTitle>
                <Fragment>
                  {t('sidebar.playlists')}
                  <PlaylistOptionsButtons />
                </Fragment>
              </SectionTitle>
              <div className="space-y-1">
                {playlists.length > 0 ? (
                  <SidebarPlaylistGenerator playlists={playlists} />
                ) : (
                  <span className="w-full truncate text-left px-3 pt-2 text-sm">
                    {t('sidebar.emptyPlaylist')}
                  </span>
                )}
              </div>
            </SidebarSection>
          </div>
        </ScrollArea>
      </div>

      <CreatePlaylistDialog />
    </Fragment>
  )
}

function SidebarSection({ children }: { children: ReactNode }) {
  return <div className="px-4 py-2 pt-0">{children}</div>
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight flex justify-between items-center">
      {children}
    </h2>
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
