import {
  LayoutGrid,
  Library,
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

import { Link } from 'react-router-dom'

import { cn } from "@/lib/utils"
import { Button } from "@/app/components/ui/button"
import { ScrollArea } from "@/app/components/ui/scroll-area"
import { ReactNode, useEffect, useState } from "react"
import { Playlist } from "@/types/responses/playlist"
import { getPlaylists } from "@/service/getPlaylists"

interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> { }

export function Sidebar({ className }: SidebarProps) {
  const [playlists, setPlaylists] = useState<Playlist[]>([])

  useEffect(() => {
    const fetchPlaylists = async () => {
      const response = await getPlaylists()
      response ? setPlaylists(response) : setPlaylists([])
    }
    fetchPlaylists()
  }, [])

  return (
    <div className={cn(className)}>
      <ScrollArea className="h-full">
        <div className="space-y-4 py-4 w-[90%]">
          <SidebarSection>
            <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
              Albums
            </h2>
            <div className="space-y-1">
              {albumsItems.map((item, index) => (
                <Link to={item.route}>
                  <Button key={index} variant="ghost" size="sm" className="w-full justify-start">
                    {item.icon}
                    {item.title}
                  </Button>
                </Link>
              ))}
            </div>
          </SidebarSection>
          <SidebarSection>
            <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
              Library
            </h2>
            <div className="space-y-1">
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Mic2 className="mr-2 h-4 w-4" />
                Artists
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Music2 className="mr-2 h-4 w-4" />
                Songs
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Library className="mr-2 h-4 w-4" />
                Albums
              </Button>
              <Button variant="ghost" size="sm" className="w-full justify-start">
                <Radio className="mr-2 h-4 w-4" />
                Radios
              </Button>
            </div>
          </SidebarSection>
          <SidebarSection>
            <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
              Playlists
            </h2>
            <div className="space-y-1 flex flex-col">
              {playlists?.map((playlist) => (
                <Button
                  key={playlist.id}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start"
                >
                  <ListMusic className="mr-2 h-4 w-4" />
                  <span className="w-full truncate text-left">{playlist.name}</span>
                </Button>
              ))}
            </div>
          </SidebarSection>
        </div>
      </ScrollArea>
    </div>
  )
}

const iconClassName = "mr-2 h-4 w-4"

const albumsItems = [
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
  {
    title: 'Recently Added',
    route: '/albums/recently-added',
    icon: <SquarePlus className={iconClassName} />
  },
  {
    title: 'Recently Played',
    route: '/albums/recently-played',
    icon: <PlayCircle className={iconClassName} />
  },
  {
    title: 'Most Played',
    route: '/albums/most-played',
    icon: <Repeat2 className={iconClassName} />
  },
]

function SidebarSection({ children }: { children: ReactNode }) {
  return (
    <div className="px-4 py-2">
      {children}
    </div>
  )
}