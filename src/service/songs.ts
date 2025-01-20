import { httpClient } from '@/api/httpClient'
import {
  GetSongResponse,
  RandomSongsResponse,
  TopSongsResponse,
} from '@/types/responses/song'
import { search } from './search'

interface GetRandomSongsParams {
  size?: number
  genre?: string
  fromYear?: number
  toYear?: number
}

async function getRandomSongs({
  size,
  genre,
  fromYear,
  toYear,
}: GetRandomSongsParams) {
  const response = await httpClient<RandomSongsResponse>('/getRandomSongs', {
    method: 'GET',
    query: {
      size: size?.toString(),
      genre,
      fromYear: fromYear?.toString(),
      toYear: toYear?.toString(),
    },
  })

  return response?.data.randomSongs.song
}

async function getTopSongs(artistName: string) {
  const response = await httpClient<TopSongsResponse>('/getTopSongs', {
    method: 'GET',
    query: {
      artist: artistName,
    },
  })

  return response?.data.topSongs.song
}

async function getAllSongs(songCount: number) {
  const response = await search.get({
    query: '',
    albumCount: 0,
    artistCount: 0,
    songCount,
    songOffset: 0,
  })

  return response?.song ?? []
}

async function getSong(id: string) {
  const response = await httpClient<GetSongResponse>('/getSong', {
    method: 'GET',
    query: {
      id,
    },
  })

  return response?.data.song
}

export const songs = {
  getAllSongs,
  getRandomSongs,
  getTopSongs,
  getSong,
}
