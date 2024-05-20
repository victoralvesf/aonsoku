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

import { cn } from "@/lib/utils"
import { Button } from "@/app/components/ui/button"
import { ScrollArea } from "@/app/components/ui/scroll-area"
import { useEffect, useState } from "react"
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
    <div className={cn("pb-12", className)}>
      <div className="space-y-4 py-4">
        <div className="px-4 py-2">
          <h2 className="mb-2 px-2 text-lg font-semibold tracking-tight">
            Albums
          </h2>
          <div className="space-y-1">
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <LayoutGrid className="mr-2 h-4 w-4" />
              All
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <Shuffle className="mr-2 h-4 w-4" />
              Random
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <Heart className="mr-2 h-4 w-4" />
              Favourites
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <Star className="mr-2 h-4 w-4" />
              Top Rated
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <SquarePlus className="mr-2 h-4 w-4" />
              Recently Added
            </Button>
            <Button variant="secondary" size="sm" className="w-full justify-start">
              <PlayCircle className="mr-2 h-4 w-4" />
              Recently Played
            </Button>
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <Repeat2 className="mr-2 h-4 w-4" />
              Most Played
            </Button>
          </div>
        </div>
        <div className="px-4 py-2">
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
        </div>
        <div className="py-2">
          <h2 className="relative px-6 text-lg font-semibold tracking-tight">
            Playlists
          </h2>
          <ScrollArea className="h-[300px] px-2">
            <div className="space-y-1 p-2">
              {playlists?.map((playlist) => (
                <Button
                  key={playlist.id}
                  variant="ghost"
                  size="sm"
                  className="w-full justify-start font-normal"
                >
                  <ListMusic className="mr-2 h-4 w-4" />
                  {playlist.name}
                </Button>
              ))}
            </div>
          </ScrollArea>
        </div>
      </div>
    </div>
  )
}