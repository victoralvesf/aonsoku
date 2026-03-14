import { useQuery } from '@tanstack/react-query'
import { getAnimatedArtworkUrl } from '@/api/artworkClient'
import { useAppAnimatedCovers } from '@/store/app.store'
import { queryKeys } from '@/utils/queryKeys'

export function useAnimatedAlbumArtwork(
  artist?: string,
  album?: string,
  enabled = true,
) {
  const { baseUrl, customUrlEnabled } = useAppAnimatedCovers()
  const normalizedArtist = artist?.trim() || ''
  const normalizedAlbum = album?.trim() || ''
  const normalizedBaseUrl = customUrlEnabled
    ? baseUrl.trim().toLowerCase()
    : 'default'

  return useQuery({
    queryKey: [
      queryKeys.album.animatedArtwork,
      normalizedArtist.toLowerCase(),
      normalizedAlbum.toLowerCase(),
      normalizedBaseUrl,
    ],
    queryFn: () => getAnimatedArtworkUrl(normalizedArtist, normalizedAlbum),
    enabled: enabled && !!normalizedArtist && !!normalizedAlbum,
    staleTime: Number.POSITIVE_INFINITY,
    gcTime: Number.POSITIVE_INFINITY,
    retry: false,
    refetchOnMount: false,
    refetchOnReconnect: false,
    refetchOnWindowFocus: false,
  })
}
