import { useQuery } from '@tanstack/react-query'
import { subsonic } from '@/service/subsonic'
import { queryKeys } from '@/utils/queryKeys'

export const useGetRandomSongs = () => {
  return useQuery({
    queryKey: [queryKeys.song.random],
    queryFn: () => subsonic.songs.getRandomSongs(),
    gcTime: 0,
  })
}

export const useGetRecentlyAdded = () => {
  return useQuery({
    queryKey: [queryKeys.album.recentlyAdded],
    queryFn: () =>
      subsonic.albums.getAlbumList({
        size: 16,
        type: 'newest',
      }),
    gcTime: 0,
  })
}

export const useGetMostPlayed = () => {
  return useQuery({
    queryKey: [queryKeys.album.mostPlayed],
    queryFn: () =>
      subsonic.albums.getAlbumList({
        size: 16,
        type: 'frequent',
      }),
    gcTime: 0,
  })
}

export const useGetRecentlyPlayed = () => {
  return useQuery({
    queryKey: [queryKeys.album.recentlyPlayed],
    queryFn: () =>
      subsonic.albums.getAlbumList({
        size: 16,
        type: 'recent',
      }),
    gcTime: 0,
  })
}

export const useGetRandomAlbums = () => {
  return useQuery({
    queryKey: [queryKeys.album.random],
    queryFn: () =>
      subsonic.albums.getAlbumList({
        size: 16,
        type: 'random',
      }),
    gcTime: 0,
  })
}
