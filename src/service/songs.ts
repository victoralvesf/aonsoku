import { httpClient } from "@/api/httpClient";
import { LyricsResponse, RandomSongsResponse, TopSongsResponse } from "@/types/responses/song";

async function getRandomSongs(size = 10) {
  const response = await httpClient<RandomSongsResponse>('/getRandomSongs', {
    method: 'GET',
    query: {
      size: size.toString(),
    }
  })

  return response?.randomSongs.song
}

async function getTopSongs(artistName: string) {
  const response = await httpClient<TopSongsResponse>('/getTopSongs', {
    method: 'GET',
    query: {
      artist: artistName,
    }
  })

  return response?.topSongs.song
}

async function getLyrics(artistName: string, songName: string) {
  const response = await httpClient<LyricsResponse>('/getLyrics', {
    method: 'GET',
    query: {
      artist: artistName,
      title: songName
    }
  })

  return response?.lyrics
}

export const songs = {
  getRandomSongs,
  getTopSongs,
  getLyrics
}
