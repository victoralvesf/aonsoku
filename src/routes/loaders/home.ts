import { defer } from 'react-router-dom'
import { subsonic } from '@/service/subsonic'
import { useAppStore } from '@/store/app.store'

export async function homeLoader() {
  const { url } = useAppStore.getState().data
  if (!url || url === '') return null

  const randomSongsPromise = subsonic.songs.getRandomSongs()
  const newestAlbumsPromise = subsonic.albums.getAlbumList({
    size: 16,
    type: 'newest',
  })
  const frequentAlbumsPromise = subsonic.albums.getAlbumList({
    size: 16,
    type: 'frequent',
  })
  const recentAlbumsPromise = subsonic.albums.getAlbumList({
    size: 16,
    type: 'recent',
  })
  const randomAlbumsPromise = subsonic.albums.getAlbumList({
    size: 16,
    type: 'random',
  })

  return defer({
    randomSongsPromise,
    newestAlbumsPromise,
    frequentAlbumsPromise,
    recentAlbumsPromise,
    randomAlbumsPromise,
  })
}
