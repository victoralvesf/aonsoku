import { RPC } from './discord'

export type RpcPayload = {
  trackName: string
  albumName: string
  artist: string
  startTime: number
  endTime: number
}

export function setDiscordRpcActivity(payload: RpcPayload) {
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
        large_image: 'icon',
        small_image: 'song_icon',
      },
    })
  } catch {}
}

export function clearDiscordRpcActivity() {
  RPC.set(null)
}
