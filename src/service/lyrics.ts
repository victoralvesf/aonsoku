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
  const { lyricsSourcePriority } = usePlayerStore.getState().settings.privacy

  // Define lyrics source fetchers
  const sourceMap: Record<string, (data: GetLyricsData) => Promise<any>> = {
    lrcapi: getLyricsFromLrcApi,
    lrclib: getLyricsFromLRCLib,
    subsonic: async (data) => {
      const response = await httpClient<LyricsResponse>('/getLyrics', {
        method: 'GET',
        query: {
          artist: data.artist,
          title: data.title,
        },
      })
      return (
        response?.data.lyrics || {
          artist: data.artist,
          title: data.title,
          value: '',
        }
      )
    },
  }

  // New logic:
  // 1. If not prefer synced lyrics, use subsonic only
  if (!preferSyncedLyrics) {
    return await sourceMap['subsonic'](getLyricsData)
  }

  // 2. If prefer synced lyrics, try sources strictly by user priority (could include lrclib, lrcapi, subsonic)
  const sources =
    lyricsSourcePriority && lyricsSourcePriority.length > 0
      ? lyricsSourcePriority
      : ['lrclib', 'lrcapi', 'subsonic']

  for (const src of sources) {
    const key = src.toLowerCase()
    if (!sourceMap[key]) continue
    const lyrics = await sourceMap[key](getLyricsData)
    if (lyrics && lyrics.value !== '') return lyrics
  }

  // Fallback if all sources fail
  return { artist: getLyricsData.artist, title: getLyricsData.title, value: '' }
}

async function getLyricsFromLRCLib(getLyricsData: GetLyricsData) {
  const { lrcLibEnabled } = usePlayerStore.getState().settings.privacy
  const { isLms } = checkServerType()

  const { title, album, duration } = getLyricsData

  // LMS server tends to join all artists into a single string
  // e.g. "Cartoon, Jeja, Daniel Levi, Time To Talk"
  // For LRCLIB to work correctly, only send the first artist
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

// Fetch lyrics from LRCAPI
async function getLyricsFromLrcApi(getLyricsData: GetLyricsData) {
  const { title, artist, album } = getLyricsData
  try {
    const params = new URLSearchParams()
    if (title) params.append('title', title)
    if (album) params.append('album', album)
    if (artist) params.append('artist', artist)
    // Use proxy path in local dev, real path in production
    const isDev =
      typeof window !== 'undefined' &&
      window.location &&
      window.location.origin.includes('localhost')
    const url = isDev
      ? `/api/lrc/lyrics?${params.toString()}`
      : `https://api.lrc.cx/lyrics?${params.toString()}`

    let lyric = ''
    try {
      const response = await fetch(url)
      lyric = await response.text()
    } catch {}

    // Filter lyric lines: keep only lines with timestamp, remove [Intro], [Verse], [Chorus] etc. without timestamp
    function filterLyricLines(raw: string) {
      // Remove meaningless lines like [99:00.000]纯音乐，请欣赏
      return raw
        .split(/\r?\n/)
        .filter((line) => {
          // Only keep lines with timestamp and not '纯音乐，请欣赏' etc.
          if (/\[\d{2}:\d{2}\.\d{2,3}\]/.test(line)) {
            // Remove both Chinese and English 'Instrumental' tips
            const content = line.replace(/\[\d{2}:\d{2}\.\d{2,3}\]/, '').trim()
            if (
              content === '' ||
              /纯音乐请欣赏|纯音乐，请欣赏|Instrumental/i.test(content)
            ) {
              return false
            }
            return true
          }
          return false
        })
        .join('\n')
    }
    return {
      artist,
      title,
      value: lyric ? filterLyricLines(formatLyrics(lyric)) : '',
    }
  } catch {}
}

export const lyrics = {
  getLyrics,
  getLyricsFromLRCLib,
  getLyricsFromLrcApi,
}
