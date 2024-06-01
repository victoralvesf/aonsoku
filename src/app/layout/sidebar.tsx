import { ReactNode, useEffect, useState } from "react"
import {
  ListMusic,
  Mic2,
  Music2,
  Radio,
  Home,
  Search,
  Library
} from "lucide-react"

import { cn } from "@/lib/utils"
import { ScrollArea } from "@/app/components/ui/scroll-area"
import { Playlist } from "@/types/responses/playlist"
import { SidebarGenerator, SidebarPlaylistGenerator } from "@/app/components/sidebar-generator"
import { subsonic } from "@/service/subsonic"
import { ROUTES } from "@/routes/routesList"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
  const [playlists, setPlaylists] = useState<Playlist[]>([])

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
        <div className="space-y-4 py-4 min-w-[275px] max-w-[275px]">
          <SidebarSection>
            <div className="space-y-1">
              <SidebarGenerator list={mainMenuItems} />
            </div>
          </SidebarSection>
          <SidebarSection>
            <SectionTitle>Library</SectionTitle>
            <div className="space-y-1">
              <SidebarGenerator list={libraryItems} />
            </div>
          </SidebarSection>
          {playlists.length > 0 && (
            <SidebarSection>
              <SectionTitle>Playlists</SectionTitle>
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
    <div className="px-4 py-2">
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
    title: 'Home',
    route: ROUTES.LIBRARY.HOME,
    icon: <Home className={iconClassName} />
  },
  {
    title: 'Search',
    route: '/search',
    icon: <Search className={iconClassName} />
  },
]

const libraryItems = [
  {
    title: 'Artists',
    route: ROUTES.LIBRARY.ARTISTS,
    icon: <Mic2 className={iconClassName} />
  },
  {
    title: 'Songs',
    route: ROUTES.LIBRARY.SONGS,
    icon: <Music2 className={iconClassName} />
  },
  {
    title: 'Albums',
    route: ROUTES.LIBRARY.ALBUMS,
    icon: <Library className={iconClassName} />
  },
  {
    title: 'Playlists',
    route: ROUTES.LIBRARY.PLAYLISTS,
    icon: <ListMusic className={iconClassName} />
  },
  {
    title: 'Radios',
    route: ROUTES.LIBRARY.RADIOS,
    icon: <Radio className={iconClassName} />
  },
]
