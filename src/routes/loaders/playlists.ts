import { subsonic } from '@/service/subsonic'
import { LoaderFunctionArgs } from 'react-router-dom'

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
