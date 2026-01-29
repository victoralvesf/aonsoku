import { useQueryClient } from '@tanstack/react-query'
import { useLocation } from 'react-router-dom'
import { ROUTES } from '@/routes/routesList'
import { queryKeys } from '@/utils/queryKeys'

export function useRefreshFavorites() {
  const queryClient = useQueryClient()
  const location = useLocation()

  const isFavoritesPage = location.pathname === ROUTES.FAVORITES.PAGE

  const refreshFavorites = () => {
    if (!isFavoritesPage) return

    queryClient.invalidateQueries({
      queryKey: [queryKeys.favorites.songs],
    })
  }

  return { refreshFavorites }
}
