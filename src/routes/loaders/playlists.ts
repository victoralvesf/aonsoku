import { LoaderFunctionArgs } from 'react-router-dom'
import { subsonic } from '@/service/subsonic'

export async function playlistLoader({ params }: LoaderFunctionArgs) {
  const { playlistId } = params
  if (playlistId) {
    const response = await subsonic.playlists.getOne(playlistId)

    if (!response) {
      throw new Response('Not Found', { status: 404 })
    }

    return response
  }
}
