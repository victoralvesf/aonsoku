import { httpClient } from '@/api/httpClient'
import { LyricsResponse } from '@/types/responses/song'

interface GetLyricsData {
  artist: string
  title: string
}

interface LRCLibResponse {
  id: number
  trackName: string
  artistName: string
  plainLyrics: string
  syncedLyrics: string
}

async function getLyrics(getLyricsData: GetLyricsData) {
  const response = await httpClient<LyricsResponse>('/getLyrics', {
    method: 'GET',
    query: {
      artist: getLyricsData.artist,
      title: getLyricsData.title,
    },
  })

  if (!response || !response?.data.lyrics || !response.data.lyrics.value) {
    return getLyricsFromLRCLib(getLyricsData)
  }

  return response?.data.lyrics
}

async function getLyricsFromLRCLib({ artist, title }: GetLyricsData) {
  try {
    const params = new URLSearchParams({
      artist_name: artist,
      track_name: title,
    })

    const request = await fetch(
      'https://lrclib.net/api/get?' + params.toString(),
    )
    const response: LRCLibResponse = await request.json()

    if (response) {
      return {
        artist,
        title,
        value:
          formatLyrics(response?.syncedLyrics) ||
          formatLyrics(response?.plainLyrics) ||
          '',
      }
    }
  } catch {}

  return {
    artist,
    title,
    value: '',
  }
}

function formatLyrics(lyrics: string) {
  return lyrics.trim().replaceAll('\r\n', '\n')
}

export const lyrics = {
  getLyrics,
  getLyricsFromLRCLib,
}
