import { useQuery } from '@tanstack/react-query'
import { getFavoriteSongs } from '@/queries/songs'
import { queryKeys } from '@/utils/queryKeys'

export function useFavoriteSongs() {
  return useQuery({
    queryKey: [queryKeys.favorites.songs],
    queryFn: getFavoriteSongs,
  })
}
