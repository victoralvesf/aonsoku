import { ISong } from '@/types/responses/song'
import { isDesktop } from './desktop'

function send(song: ISong, currentTime = 0, duration = 0) {
  if (!isDesktop()) return

  currentTime = currentTime * 1000
  duration = duration * 1000

  const artist = song.artists
    ? song.artists.map((artist) => artist.name).join(', ')
    : song.artist

  const statusData = {
    trackName: song.title,
    albumName: song.album,
    artist,
    startTime: Math.floor(Date.now() - currentTime),
    endTime: Math.floor(Date.now() - currentTime + duration),
  }

  window.api.setDiscordRpcActivity(statusData)
}

function clear() {
  if (!isDesktop()) return

  window.api.clearDiscordRpcActivity()
}

export const discordRpc = {
  send,
  clear,
}
