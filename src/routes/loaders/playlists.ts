import { subsonic } from '@/service/subsonic'
import { LoaderFunctionArgs } from 'react-router-dom'

export async function playlistLoader({ params }: LoaderFunctionArgs<any>) {
  const { playlistId } = params
  if (playlistId) {
    return await subsonic.playlists.getOne(playlistId)
  }
}