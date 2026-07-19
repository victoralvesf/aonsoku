import { get, set } from 'idb-keyval'
import { iso6392BTo1, iso6392TTo1 } from 'iso-639-2'
import { httpClient } from '@/api/httpClient'
import { useAppStore } from '@/store/app.store'
import { usePlayerStore } from '@/store/player.store'
import {
  ILyric,
  IStructuredLine,
  IStructuredLyric,
  LyricsResponse,
  StructuredLyricsResponse,
} from '@/types/responses/song'
import { lrclibClient } from '@/utils/appName'
import { checkServerType, getServerExtensions } from '@/utils/servers'
import { pickPrimarySyncedStructuredLyric } from '@/utils/wordTiming'

type LyricsResult = ILyric & {
  structuredLyric?: IStructuredLyric
}

// normalizes the ISO 639 code returned by the server to the BCP 47 language tag recognized by the html lang selector
function normalizeLangCode(lang: string | undefined): string | undefined {
  if (!lang) return lang

  const parts = lang.split('-')
  const primary = parts[0].toLowerCase()

  const mapped = iso6392BTo1[primary] ?? iso6392TTo1[primary]
  if (mapped) {
    parts[0] = mapped
    return parts.join('-')
  }

  return lang
}

interface GetLyricsData {
  id: string
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

async function getLyrics(
  getLyricsData: GetLyricsData,
): Promise<LyricsResult | undefined> {
  const { preferSyncedLyrics, preferWordLevelLyrics } =
    usePlayerStore.getState().settings.lyrics
  const { songLyricsEnabled, songLyricsV2Enabled } = getServerExtensions()
  const cacheEnabled = useAppStore.getState().pages.lyricsCacheEnabled
  const useWordLevel = songLyricsV2Enabled && preferWordLevelLyrics

  const cacheKey = getLyricsCacheKey(
    getLyricsData,
    preferSyncedLyrics,
    songLyricsEnabled,
    useWordLevel,
  )

  const readCache = cacheEnabled
    ? (key: string) => get(key)
    : async () => undefined
  const writeCache = cacheEnabled
    ? (key: string, value: unknown) => set(key, value)
    : () => undefined

  const cachedLyrics = await readCache(cacheKey)

  if (cachedLyrics) {
    return cachedLyrics
  }

  // First attempt to retrieve lyrics from the server.
  // If we know it supports the OpenSubsonic songLyrics extension with timing info, use that.
  // If the server does not support the extension or the lyrics returned from the server did
  // not include timing information, fetch them from the LrcLib

  let osUnsyncedLyricsFound: ILyric | undefined

  if (songLyricsEnabled) {
    const response = await httpClient<StructuredLyricsResponse>(
      '/getLyricsBySongId',
      {
        method: 'GET',
        query: {
          id: getLyricsData.id,
          ...(useWordLevel ? { enhanced: 'true' } : {}),
        },
      },
    )

    if (response && preferSyncedLyrics) {
      const { structuredLyrics } = response.data.lyricsList

      if (structuredLyrics && structuredLyrics.length > 0) {
        const syncedLyrics = pickPrimarySyncedStructuredLyric(structuredLyrics)

        if (syncedLyrics) {
          const serverSyncedLyrics: LyricsResult = {
            ...osStructuredLyricsToILyric(syncedLyrics),
            structuredLyric: syncedLyrics,
          }

          writeCache(cacheKey, serverSyncedLyrics)

          return serverSyncedLyrics
        }
      }

      // save the plain lyrics retrieved from the server
      osUnsyncedLyricsFound = osStructuredLyricsToILyric(structuredLyrics[0])
    }
  }

  if (preferSyncedLyrics) {
    const lyrics = await getLyricsFromLRCLib(getLyricsData)

    if (lyrics.value !== '') {
      writeCache(cacheKey, lyrics)

      return lyrics
    }
  }

  // if the server supported the songLyrics extension and lrc did not have lyrics, we don't need to query the server and lrc again.
  // so return the plain lyrics if we found them
  if (osUnsyncedLyricsFound) {
    writeCache(cacheKey, osUnsyncedLyricsFound)

    return osUnsyncedLyricsFound
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
    const lyrics = await getLyricsFromLRCLib(getLyricsData)

    if (lyrics.value !== '') {
      writeCache(cacheKey, lyrics)
    }

    return lyrics
  }

  if (response?.data.lyrics) {
    writeCache(cacheKey, response.data.lyrics)
  }

  return response?.data.lyrics
}

async function getLyricsFromLRCLib(getLyricsData: GetLyricsData) {
  const { lrclib } = usePlayerStore.getState().settings.privacy
  const { isLms } = checkServerType()

  const { title, album, duration } = getLyricsData

  // LMS server tends to join all artists into a single string
  // Ex: "Cartoon, Jeja, Daniel Levi, Time To Talk"
  // To LRCLIB work correctly, we have to send only one
  const artist = isLms
    ? getLyricsData.artist.split(',')[0]
    : getLyricsData.artist

  if (!lrclib.enabled || window.DISABLE_LRCLIB) {
    return {
      artist,
      title,
      value: '',
      lang: 'xxx',
    }
  }

  try {
    const params = new URLSearchParams({
      artist_name: artist,
      track_name: title,
    })

    if (duration) params.append('duration', duration.toString())
    if (album) params.append('album_name', album)

    let defaultLrcLibUrl = 'https://lrclib.net/api/get'

    if (lrclib.customUrlEnabled && lrclib.customUrl !== '') {
      defaultLrcLibUrl = `${lrclib.customUrl}/api/get`
    }

    const url = new URL(defaultLrcLibUrl)
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
        lang: 'xxx',
      }
    }
  } catch {}

  return {
    artist,
    title,
    value: '',
    lang: 'xxx',
  }
}

function formatLyrics(lyrics: string) {
  return lyrics.trim().replaceAll('\r\n', '\n')
}

function getLyricsCacheKey(
  getLyricsData: GetLyricsData,
  preferSyncedLyrics: boolean,
  songLyricsEnabled?: boolean,
  songLyricsV2Enabled?: boolean,
) {
  const { artist, title } = getLyricsData

  const type = preferSyncedLyrics ? 'synced' : 'plain'
  const serverExtension = songLyricsEnabled ? 'internal' : 'external'

  const keys = ['lyrics', artist, title, type, serverExtension]
  if (songLyricsV2Enabled) keys.push('v2')

  return keys.join(':')
}

function osStructuredLyricsToILyric(lyrics: IStructuredLyric): ILyric {
  return {
    artist: lyrics.displayArtist,
    title: lyrics.displayTitle,
    lang: normalizeLangCode(lyrics.lang),
    value: formatLyrics(lyrics.line.map(osLineToILyricLine).join('\n')),
  }
}

function osLineToILyricLine(line: IStructuredLine): string {
  if (line.start !== undefined) {
    return `[${osStartMsToSongTimestamp(line.start)}] ${line.value}`
  }
  return line.value
}

function osStartMsToSongTimestamp(startTime: number): string {
  // Date() isoString is formatted as:
  // YYYY-MM-DDTHH:mm:ss.sssZ -> mm:ss.ss
  // 2011-10-05T14:48:00.000Z -> 48:00.00
  return new Date(startTime).toISOString().slice(14, -2)
}

export const lyrics = {
  getLyrics,
  getLyricsFromLRCLib,
}
