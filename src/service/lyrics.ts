import { httpClient } from '@/api/httpClient'
import { usePlayerStore } from '@/store/player.store'
import { LyricsResponse } from '@/types/responses/song'
import { lrclibClient } from '@/utils/appName'

interface GetLyricsData {
  artist: string
  title: string
  album?: string
  duration?: number
}

interface LRCLibResponse {
  id: number
  trackName: string
  artistName: string
  plainLyrics: string
  syncedLyrics: string
}

async function getLyrics(getLyricsData: GetLyricsData) {
  const { preferSyncedLyrics } = usePlayerStore.getState().settings.lyrics

  if (preferSyncedLyrics) {
    return getLyricsFromLRCLib(getLyricsData)
  }

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

async function getLyricsFromLRCLib(getLyricsData: GetLyricsData) {
  const { artist, title, album, duration } = getLyricsData

  try {
    const params = new URLSearchParams({
      artist_name: artist,
      track_name: title,
    })

    if (duration) params.append('duration', duration.toString())
    if (album) params.append('album_name', album)

    const url = new URL('https://lrclib.net/api/get')
    url.search = params.toString()

    const request = await fetch(url.toString(), {
      headers: {
        'Lrclib-Client': lrclibClient,
      },
    })
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
