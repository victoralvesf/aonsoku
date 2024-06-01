import { Link, useLocation } from "react-router-dom"
import { ListMusic } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Playlist } from "@/types/responses/playlist"
import { ROUTES } from "@/routes/routesList"

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

  function isActive(id: string) {
    return location.pathname === ROUTES.PLAYLIST.PAGE(id) ? 'secondary' : 'ghost'
  }

  return (
    <>
      {playlists.map((playlist) => (
        <Link to={ROUTES.PLAYLIST.PAGE(playlist.id)} key={playlist.id}>
          <Button variant={isActive(playlist.id)} size="sm" className="w-full justify-start">
            <ListMusic className="mr-2 h-4 w-4" />
            <span className="w-full truncate text-left">{playlist.name}</span>
          </Button>
        </Link>
      ))}
    </>
  )
}