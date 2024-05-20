import { httpClient } from "@/api/httpClient"
import { PlaylistsResponse } from "@/types/responses/playlist"

export async function getPlaylists() {
  const response = await httpClient<PlaylistsResponse>('/getPlaylists', {
    method: 'GET'
  })

  return response?.playlists.playlist
}