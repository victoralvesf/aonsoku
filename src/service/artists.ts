import { httpClient } from '@/api/httpClient'
import {
  ArtistInfoResponse,
  ArtistResponse,
  ArtistsResponse,
} from '@/types/responses/artist'

async function getAll() {
  const response = await httpClient<ArtistsResponse>('/getArtists', {
    method: 'GET',
  })

  return response?.data.artists.index
}

async function getOne(id: string) {
  const response = await httpClient<ArtistResponse>('/getArtist', {
    method: 'GET',
    query: {
      id,
    },
  })

  return response?.data.artist
}

async function getInfo(id: string) {
  const response = await httpClient<ArtistInfoResponse>('/getArtistInfo', {
    method: 'GET',
    query: {
      id,
    },
  })

  return response?.data.artistInfo
}

export const artists = {
  getOne,
  getInfo,
  getAll,
}
