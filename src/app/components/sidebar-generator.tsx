import { Link, useLocation } from "react-router-dom"
import { Button } from "./ui/button"
import { Playlist } from "@/types/responses/playlist"
import { ListMusic } from "lucide-react"

interface ISidebarItem {
  title: string
  route: string
  icon: JSX.Element
}

export function SidebarGenerator({ list }: { list: ISidebarItem[] }) {
  const location = useLocation()

  return (
    <>
      {list.map((item, index) => (
        <Link to={item.route} key={index}>
          {location.pathname === item.route ? (
            <Button variant="secondary" size="sm" className="w-full justify-start">
              {item.icon}
              {item.title}
            </Button>
          ) : (
            <Button variant="ghost" size="sm" className="w-full justify-start">
              {item.icon}
              {item.title}
            </Button>
          )}
        </Link>
      ))}
    </>
  )
}

export function SidebarPlaylistGenerator({ playlists }: { playlists: Playlist[] }) {
  const location = useLocation()

  function isCurrentRouteAPlaylist(id: string) {
    return location.pathname === `/playlist/${id}`
  }

  return (
    <>
      {playlists.map((playlist) => (
        <Link to={`/playlist/${playlist.id}`} key={playlist.id}>
          {isCurrentRouteAPlaylist(playlist.id) ? (
            <Button variant="secondary" size="sm" className="w-full justify-start">
              <ListMusic className="mr-2 h-4 w-4" />
              <span className="w-full truncate text-left">{playlist.name}</span>
            </Button>
          ) : (
            <Button variant="ghost" size="sm" className="w-full justify-start">
              <ListMusic className="mr-2 h-4 w-4" />
              <span className="w-full truncate text-left">{playlist.name}</span>
            </Button>
          )}
        </Link>
      ))}
    </>
  )
}