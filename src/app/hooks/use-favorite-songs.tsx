import { useQuery } from '@tanstack/react-query'
import { getFavoriteSongs } from '@/queries/songs'
import { convertMinutesToMs } from '@/utils/convertSecondsToTime'
import { queryKeys } from '@/utils/queryKeys'

export function useFavoriteSongs() {
  return useQuery({
    queryKey: [queryKeys.favorites.songs],
    queryFn: getFavoriteSongs,
    staleTime: convertMinutesToMs(5),
    gcTime: convertMinutesToMs(5),
  })
}
