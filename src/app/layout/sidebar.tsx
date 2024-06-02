import { ReactNode, useEffect, useState } from "react"
import { useTranslation } from 'react-i18next'
import {
  ListMusic,
  Mic2,
  Music2,
  Radio,
  Home,
  Library,
} from "lucide-react"

import { cn } from "@/lib/utils"
import { ScrollArea } from "@/app/components/ui/scroll-area"
import { Playlist } from "@/types/responses/playlist"
import { SidebarGenerator, SidebarPlaylistGenerator } from "@/app/components/sidebar-generator"
import { subsonic } from "@/service/subsonic"
import { ROUTES } from "@/routes/routesList"
import CommandMenu from "@/app/components/command/command-menu"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const { t } = useTranslation()

  useEffect(() => {
    const fetchPlaylists = async () => {
      const response = await subsonic.playlists.getAll()
      response ? setPlaylists(response) : setPlaylists([])
    }
    fetchPlaylists()
  }, [])

  return (
    <div className={cn(className)}>
      <ScrollArea className="h-full">
        <div className="px-4 sticky top-0 py-4 z-50 bg-background">
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
          {playlists.length > 0 && (
            <SidebarSection>
              <SectionTitle>{t('sidebar.playlists')}</SectionTitle>
              <div className="space-y-1">
                <SidebarPlaylistGenerator playlists={playlists} />
              </div>
            </SidebarSection>
          )}
        </div>
      </ScrollArea>
    </div>
  )
}

function SidebarSection({ children }: { children: ReactNode }) {
  return (
    <div className="px-4 py-2 pt-0">
      {children}
    </div>
  )
}

function SectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
      {children}
    </h2>
  )
}

const iconClassName = "mr-2 h-4 w-4"

const mainMenuItems = [
  {
    title: 'sidebar.home',
    route: ROUTES.LIBRARY.HOME,
    icon: <Home className={iconClassName} />
  },
]

const libraryItems = [
  {
    title: 'sidebar.artists',
    route: ROUTES.LIBRARY.ARTISTS,
    icon: <Mic2 className={iconClassName} />
  },
  {
    title: 'sidebar.songs',
    route: ROUTES.LIBRARY.SONGS,
    icon: <Music2 className={iconClassName} />
  },
  {
    title: 'sidebar.albums',
    route: ROUTES.LIBRARY.ALBUMS,
    icon: <Library className={iconClassName} />
  },
  {
    title: 'sidebar.playlists',
    route: ROUTES.LIBRARY.PLAYLISTS,
    icon: <ListMusic className={iconClassName} />
  },
  {
    title: 'sidebar.radios',
    route: ROUTES.LIBRARY.RADIOS,
    icon: <Radio className={iconClassName} />
  },
]
