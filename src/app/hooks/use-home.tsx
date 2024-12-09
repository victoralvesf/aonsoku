import { useQuery } from '@tanstack/react-query'
import { subsonic } from '@/service/subsonic'
import { convertMinutesToMs } from '@/utils/convertSecondsToTime'
import { queryKeys } from '@/utils/queryKeys'

export const useGetRandomSongs = () => {
  return useQuery({
    queryKey: [queryKeys.song.random],
    queryFn: () => subsonic.songs.getRandomSongs({ size: 10 }),
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
    refetchInterval: convertMinutesToMs(2),
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
  })
}
