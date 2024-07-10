import { defer, LoaderFunctionArgs } from 'react-router-dom'
import { subsonic } from '@/service/subsonic'

export async function playlistLoader({ params }: LoaderFunctionArgs) {
  const { playlistId } = params
  if (playlistId) {
    const playlistPromise = subsonic.playlists.getOne(playlistId)

    return defer({
      playlistPromise,
    })
  }
}
