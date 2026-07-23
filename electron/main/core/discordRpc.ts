import { DEFAULT_LARGE_IMAGE, DEFAULT_SMALL_IMAGE, RPC } from './discord'

export type RpcPayload = {
  trackName: string
  albumName: string
  artist: string
  startTime: number
  endTime: number
  duration: number
  imageUrl?: string
}

function truncate(str: string, max = 128) {
  return str.length > max ? `${str.slice(0, max - 3)}...` : str
}

export async function setDiscordRpcActivity(payload: RpcPayload) {
  try {
    RPC.init()
    RPC.set({
      details: truncate(payload.trackName),
      state: truncate(`${payload.artist} • ${payload.albumName}`),
      timestamps: {
        start: payload.startTime,
        end: payload.endTime,
      },
      assets: {
        large_image: payload.imageUrl || DEFAULT_LARGE_IMAGE,
        large_text: truncate(payload.albumName),
        small_image: DEFAULT_SMALL_IMAGE,
        small_text: truncate(payload.trackName),
      },
    })
  } catch {}
}

export function clearDiscordRpcActivity() {
  RPC.set(null)
}
