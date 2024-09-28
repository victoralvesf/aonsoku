import { httpClient } from '@/api/httpClient'
import {
  GetSongResponse,
  LyricsResponse,
  RandomSongsResponse,
  TopSongsResponse,
} from '@/types/responses/song'
import { sortByString } from '@/utils/sort'
import { search } from './search'

async function getRandomSongs(size = 10) {
  const response = await httpClient<RandomSongsResponse>('/getRandomSongs', {
    method: 'GET',
    query: {
      size: size.toString(),
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

interface GetLyricsData {
  artist: string
  title: string
}

async function getLyrics({ artist, title }: GetLyricsData) {
  const response = await httpClient<LyricsResponse>('/getLyrics', {
    method: 'GET',
    query: {
      artist,
      title,
    },
  })

  return response?.data.lyrics
}

async function getAllSongs() {
  const response = await search.get({
    query: '',
    albumCount: 0,
    artistCount: 0,
    songCount: 999999999,
    songOffset: 0,
  })

  return response?.song?.sort((a, b) => sortByString(a.title, b.title)) || []
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
  getLyrics,
  getSong,
}
