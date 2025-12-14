import { useCallback } from 'react'
import { useLocation } from 'react-router-dom'
import { ROUTES } from '@/routes/routesList'

export function useRouteIsActive() {
  const location = useLocation()

  const isActive = useCallback(
    (route: string) => {
      return location.pathname === route
    },
    [location.pathname],
  )

  const isOnPlaylist = useCallback(
    (id: string) => {
      return location.pathname === ROUTES.PLAYLIST.PAGE(id)
    },
    [location.pathname],
  )

  return {
    isActive,
    isOnPlaylist,
  }
}
