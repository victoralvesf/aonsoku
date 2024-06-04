import { httpClient } from "@/api/httpClient"
import { PlaylistWithEntriesResponse, PlaylistsResponse, SinglePlaylistResponse } from "@/types/responses/playlist"
import { SubsonicResponse } from "@/types/responses/subsonicResponse"

async function getAll() {
  const response = await httpClient<PlaylistsResponse>('/getPlaylists', {
    method: 'GET'
  })

  return response?.data.playlists.playlist
}

async function getOne(id: string) {
  const response = await httpClient<PlaylistWithEntriesResponse>('/getPlaylist', {
    method: 'GET',
    query: {
      id
    }
  })

  return response?.data.playlist
}

async function remove(id: string) {
  await httpClient<SubsonicResponse>('/deletePlaylist', {
    method: 'DELETE',
    query: {
      id
    }
  })
}

async function create(name: string, songs?: string[]) {
  const query = new URLSearchParams()
  query.append('name', name)

  if (songs) {
    songs.forEach(song => query.append('songId', song))
  }

  const response = await httpClient<SinglePlaylistResponse>(`/createPlaylist?${query.toString()}`, {
    method: 'GET'
  })

  return response?.data.playlist
}

export const playlists = {
  getAll,
  getOne,
  remove,
  create
}