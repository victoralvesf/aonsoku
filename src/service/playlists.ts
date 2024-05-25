import { httpClient } from "@/api/httpClient"
import { PlaylistWithEntriesResponse, PlaylistsResponse } from "@/types/responses/playlist"

async function getAll() {
  const response = await httpClient<PlaylistsResponse>('/getPlaylists', {
    method: 'GET'
  })

  return response?.playlists.playlist
}

async function getOne(id: string) {
  const response = await httpClient<PlaylistWithEntriesResponse>('/getPlaylist', {
    method: 'GET',
    query: {
      id
    }
  })

  return response?.playlist
}

export const playlists = {
  getAll,
  getOne
}