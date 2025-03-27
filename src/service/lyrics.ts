import { httpClient } from '@/api/httpClient'
import { usePlayerStore } from '@/store/player.store'
import { LyricsResponse } from '@/types/responses/song'
import { lrclibClient } from '@/utils/appName'
import { checkServerType } from '@/utils/servers'

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

  // If the user prefers synced lyrics, attempt to fetch them from the LrcLib first.
  // If lyrics are found, return them immediately.
  // If not, proceed with the default flow.
  if (preferSyncedLyrics) {
    const lyrics = await getLyricsFromLRCLib(getLyricsData)

    if (lyrics.value !== '') return lyrics
  }

  const response = await httpClient<LyricsResponse>('/getLyrics', {
    method: 'GET',
    query: {
      artist: getLyricsData.artist,
      title: getLyricsData.title,
    },
  })

  const lyricNotFound =
    !response || !response?.data.lyrics || !response.data.lyrics.value

  // If the Subsonic API did not return lyrics and the user does not prefer synced lyrics,
  // fallback to fetching lyrics from the LrcLib.
  // Note: If `preferSyncedLyrics` is true and we reached this point, it means the LrcLib
  // does not contains lyrics for the track, so the fallback is unnecessary in that case.
  if (lyricNotFound && !preferSyncedLyrics) {
    return getLyricsFromLRCLib(getLyricsData)
  }

  return response?.data.lyrics
}

async function getLyricsFromLRCLib(getLyricsData: GetLyricsData) {
  const { lrcLibEnabled } = usePlayerStore.getState().settings.privacy
  const { isLms } = checkServerType()

  const { title, album, duration } = getLyricsData

  // LMS server tends to join all artists into a single string
  // Ex: "Cartoon, Jeja, Daniel Levi, Time To Talk"
  // To LRCLIB work correctly, we have to send only one
  const artist = isLms
    ? getLyricsData.artist.split(',')[0]
    : getLyricsData.artist

  if (!lrcLibEnabled) {
    return {
      artist,
      title,
      value: '',
    }
  }

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
      const { syncedLyrics, plainLyrics } = response

      let finalLyric = ''

      if (syncedLyrics) {
        finalLyric = syncedLyrics
      } else if (plainLyrics) {
        finalLyric = plainLyrics
      }

      return {
        artist,
        title,
        value: formatLyrics(finalLyric),
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
