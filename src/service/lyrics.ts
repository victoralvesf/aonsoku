import { get, set } from 'idb-keyval'
import { httpClient } from '@/api/httpClient'
import { usePlayerStore } from '@/store/player.store'
import {
  ILyric,
  IStructuredLyric,
  LyricsResponse,
  StructuredLyricsResponse,
} from '@/types/responses/song'
import { lrclibClient } from '@/utils/appName'
import { checkServerType, getServerExtensions } from '@/utils/servers'

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

async function getLyrics(getLyricsData: GetLyricsData) {
  const { preferSyncedLyrics } = usePlayerStore.getState().settings.lyrics
  const { songLyricsEnabled } = getServerExtensions()

  const cacheKey = getLyricsCacheKey(getLyricsData, preferSyncedLyrics)

  const cachedLyrics = await get(cacheKey)

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
        },
      },
    )

    if (preferSyncedLyrics) {
      if (
        response?.data.lyricsList.structuredLyrics &&
        response.data.lyricsList.structuredLyrics.length > 0
      ) {
        const syncedLyrics = response?.data.lyricsList.structuredLyrics.find(
          (lyrics) => lyrics.synced,
        )

        if (syncedLyrics) {
          return osStructuredLyricsToILyric(syncedLyrics)
        }
        // save the plain lyrics from this call
        osUnsyncedLyricsFound = osStructuredLyricsToILyric(
          response.data.lyricsList.structuredLyrics[0],
        )
      }
      // save the plain lyrics retrieved from the server
      osUnsyncedLyricsFound = osStructuredLyricsToILyric(
        response.data.lyricsList.structuredLyrics[0],
      )
    }
  }

  if (preferSyncedLyrics) {
    const lyrics = await getLyricsFromLRCLib(getLyricsData)

    if (lyrics.value !== '') {
      set(cacheKey, lyrics)

      return lyrics
    }
  }

  // if the server supported the songLyrics extension and lrc did not have lyrics, we don't need to query the server and lrc again.
  // so return the plain lyrics if we found them
  if (osUnsyncedLyricsFound) {
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
      set(cacheKey, lyrics)
    }

    return lyrics
  }

  if (response?.data.lyrics) {
    set(cacheKey, response.data.lyrics)
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

function getLyricsCacheKey(
  getLyricsData: GetLyricsData,
  preferSyncedLyrics: boolean,
) {
  const { artist, title } = getLyricsData

  const type = preferSyncedLyrics ? 'synced' : 'plain'

  return `lyrics:${artist}:${title}:${type}`
}

function osStructuredLyricsToILyric(lyrics: IStructuredLyric): ILyric {
  return {
    artist: lyrics.displayArtist,
    title: lyrics.displayTitle,
    value: formatLyrics(
      lyrics.line
        .map((l) => {
          const ts = l.start ? osStartMsToLRCTimestamp(l.start) : ''
          return ts ? `${ts} ${l.value}` : l.value
        })
        .join('\n'),
    ),
  }
}

function osStartMsToLRCTimestamp(startTime: number): string {
  // 2011-10-05T14:48:00.000Z -> 48:00.00
  return `[${new Date(startTime).toISOString().slice(14, -2)}]`
}

export const lyrics = {
  getLyrics,
  getLyricsFromLRCLib,
}
