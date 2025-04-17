import { deezerService } from './deezer'
import { RPC } from './discord'

export type RpcPayload = {
  trackName: string
  albumName: string
  artist: string
  startTime: number
  endTime: number
  duration: number
  useDeezer?: boolean
}

export async function setDiscordRpcActivity(payload: RpcPayload) {
  const { useDeezer = true } = payload

  let externalImage: string | null = null

  if (useDeezer) {
    try {
      const searchDeezer = await deezerService.search({
        artist: payload.artist,
        album: payload.albumName,
        track: payload.trackName,
        duration: payload.duration,
      })

      if (searchDeezer) {
        externalImage = searchDeezer.album.cover_big ?? null
      }
    } catch {}
  }

  try {
    RPC.init()
    RPC.set({
      details: payload.trackName,
      state: `${payload.artist} • ${payload.albumName}`,
      timestamps: {
        start: payload.startTime,
        end: payload.endTime,
      },
      assets: {
        large_image: externalImage ?? 'icon',
        small_image: 'song_icon',
      },
    })
  } catch {}
}

export function clearDiscordRpcActivity() {
  RPC.set(null)
}
