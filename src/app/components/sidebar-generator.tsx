import { ListMusic } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link, useLocation } from 'react-router-dom'
import { Button } from '@/app/components/ui/button'
import { ROUTES } from '@/routes/routesList'
import { Playlist } from '@/types/responses/playlist'

interface ISidebarItem {
  title: string
  route: string
  icon: JSX.Element
}

export function SidebarGenerator({ list }: { list: ISidebarItem[] }) {
  const location = useLocation()
  const { t } = useTranslation()

  function isButtonActive(route: string) {
    return location.pathname === route ? 'secondary' : 'ghost'
  }

  return (
    <>
      {list.map((item, index) => (
        <Link to={item.route} key={index}>
          <Button
            variant={isButtonActive(item.route)}
            size="sm"
            className="w-full justify-start"
          >
            {item.icon}
            {t(item.title)}
          </Button>
        </Link>
      ))}
    </>
  )
}

export function SidebarPlaylistGenerator({
  playlists,
}: {
  playlists: Playlist[]
}) {
  const location = useLocation()

  function isActive(id: string) {
    return location.pathname === ROUTES.PLAYLIST.PAGE(id)
      ? 'secondary'
      : 'ghost'
  }

  return (
    <>
      {playlists.map((playlist) => (
        <Link to={ROUTES.PLAYLIST.PAGE(playlist.id)} key={playlist.id}>
          <Button
            variant={isActive(playlist.id)}
            size="sm"
            className="w-full justify-start"
          >
            <ListMusic className="mr-2 min-h-4 min-w-4 h-4 w-4" />
            <span className="w-full truncate text-left">{playlist.name}</span>
          </Button>
        </Link>
      ))}
    </>
  )
}
