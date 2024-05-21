import {
  LayoutGrid,
  ListMusic,
  Mic2,
  Music2,
  PlayCircle,
  Radio,
  Shuffle,
  Heart,
  Star,
  SquarePlus,
  Repeat2
} from "lucide-react"

import { cn } from "@/lib/utils"
import { ScrollArea } from "@/app/components/ui/scroll-area"
import { ReactNode, useEffect, useState } from "react"
import { Playlist } from "@/types/responses/playlist"
import { SidebarGenerator, SidebarPlaylistGenerator } from "../components/sidebar-generator"
import { subsonic } from "@/service/subsonic"

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
            <SectionTitle>Albums</SectionTitle>
            <div className="space-y-1">
              <SidebarGenerator list={albumsItems} />
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

const albumsItems = [
  {
    title: 'Recently Played',
    route: '/albums/recently-played',
    icon: <PlayCircle className={iconClassName} />
  },
  {
    title: 'Recently Added',
    route: '/albums/recently-added',
    icon: <SquarePlus className={iconClassName} />
  },
  {
    title: 'Most Played',
    route: '/albums/most-played',
    icon: <Repeat2 className={iconClassName} />
  },
  {
    title: 'All',
    route: '/albums/all',
    icon: <LayoutGrid className={iconClassName} />
  },
  {
    title: 'Random',
    route: '/albums/random',
    icon: <Shuffle className={iconClassName} />
  },
  {
    title: 'Favourites',
    route: '/albums/favourites',
    icon: <Heart className={iconClassName} />
  },
  {
    title: 'Top Rated',
    route: '/albums/top-rated',
    icon: <Star className={iconClassName} />
  },
]

const libraryItems = [
  {
    title: 'Artists',
    route: '/library/artists',
    icon: <Mic2 className={iconClassName} />
  },
  {
    title: 'Songs',
    route: '/library/songs',
    icon: <Music2 className={iconClassName} />
  },
  {
    title: 'Playlists',
    route: '/library/playlists',
    icon: <ListMusic className={iconClassName} />
  },
  {
    title: 'Radios',
    route: '/library/radios',
    icon: <Radio className={iconClassName} />
  },
]
