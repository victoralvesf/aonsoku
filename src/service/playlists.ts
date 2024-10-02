import { httpClient } from '@/api/httpClient'
import {
  CreateParams,
  PlaylistWithEntriesResponse,
  PlaylistsResponse,
  SinglePlaylistResponse,
  UpdateParams,
} from '@/types/responses/playlist'
import { SubsonicResponse } from '@/types/responses/subsonicResponse'

async function getAll() {
  const response = await httpClient<PlaylistsResponse>('/getPlaylists', {
    method: 'GET',
  })

  return response?.data.playlists.playlist ?? []
}

async function getOne(id: string) {
  const response = await httpClient<PlaylistWithEntriesResponse>(
    '/getPlaylist',
    {
      method: 'GET',
      query: {
        id,
      },
    },
  )

  return response?.data.playlist
}

async function remove(id: string) {
  await httpClient<SubsonicResponse>('/deletePlaylist', {
    method: 'DELETE',
    query: {
      id,
    },
  })
}

async function create(name: string, songs?: string[]) {
  const query = new URLSearchParams()
  query.append('name', name)

  if (songs) {
    songs.forEach((song) => query.append('songId', song))
  }

  const response = await httpClient<SinglePlaylistResponse>(
    `/createPlaylist?${query.toString()}`,
    {
      method: 'GET',
    },
  )

  return response?.data.playlist
}

async function update({
  playlistId,
  name,
  comment,
  songIdToAdd,
  songIndexToRemove,
  isPublic,
}: UpdateParams) {
  const query = new URLSearchParams({
    playlistId,
  })
  if (name) query.append('name', name)
  if (comment) query.append('comment', comment)
  if (isPublic) query.append('public', isPublic)

  if (songIdToAdd) {
    if (typeof songIdToAdd === 'string') {
      query.append('songIdToAdd', songIdToAdd)
    } else {
      songIdToAdd.forEach((songId) => query.append('songIdToAdd', songId))
    }
  }

  if (songIndexToRemove) {
    if (typeof songIndexToRemove === 'string') {
      query.append('songIndexToRemove', songIndexToRemove)
    } else {
      songIndexToRemove.forEach((songIndex) =>
        query.append('songIndexToRemove', songIndex),
      )
    }
  }

  await httpClient<SubsonicResponse>(`/updatePlaylist?${query.toString()}`, {
    method: 'GET',
  })
}

export async function createWithDetails(data: CreateParams) {
  const playlist = await create(data.name)

  if (playlist) {
    await update({
      playlistId: playlist.id,
      comment: data.comment,
      isPublic: data.isPublic,
      songIdToAdd: data.songIdToAdd,
    })
  }
}

export const playlists = {
  getAll,
  getOne,
  remove,
  create,
  createWithDetails,
  update,
}
