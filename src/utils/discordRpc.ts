import { useAppStore } from '@/store/app.store'
import { ISong } from '@/types/responses/song'
import { isDesktop } from './desktop'

function send(song: ISong, currentTime = 0, duration = 0) {
  if (!isDesktop()) return

  const { rpcEnabled } = useAppStore.getState().accounts.discord
  if (!rpcEnabled) return

  const currentTimeInMs = currentTime * 1000
  const durationInMs = duration * 1000

  const artist = song.artists
    ? song.artists.map((artist) => artist.name).join(', ')
    : song.artist

  const startTime = Math.floor(Date.now() - currentTimeInMs)
  const endTime = Math.floor(Date.now() - currentTimeInMs + durationInMs)

  window.api.setDiscordRpcActivity({
    trackName: song.title,
    albumName: song.album,
    artist,
    startTime,
    endTime,
    duration,
  })
}

function clear() {
  if (!isDesktop()) return

  window.api.clearDiscordRpcActivity()
}

export const discordRpc = {
  send,
  clear,
}
