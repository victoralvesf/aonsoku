import { httpClient } from "@/api/httpClient"
import { PlaylistWithEntriesResponse, PlaylistsResponse } from "@/types/responses/playlist"

export async function getAllPlaylists() {
  const response = await httpClient<PlaylistsResponse>('/getPlaylists', {
    method: 'GET'
  })

  return response?.playlists.playlist
}

export async function getOnePlaylist(id: string) {
  const response = await httpClient<PlaylistWithEntriesResponse>('/getPlaylist', {
    method: 'GET',
    query: {
      id
    }
  })

  return response?.playlist
}