import { useAppStore } from '@/store/app.store'
import { usePlayerStore } from '@/store/player.store'
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

function sendCurrentSong() {
  if (!isDesktop()) return

  const { playerState, songlist, actions } = usePlayerStore.getState()

  const { mediaType } = playerState
  if (mediaType !== 'song') return

  const { currentSong } = songlist
  const currentTime = actions.getCurrentProgress()
  const { isPlaying, currentDuration } = playerState

  // Clear activity if paused or there is no song
  if (!currentSong || !isPlaying) discordRpc.clear()

  if (currentSong && isPlaying) {
    discordRpc.send(currentSong, currentTime, currentDuration)
  }
}

export const discordRpc = {
  send,
  clear,
  sendCurrentSong,
}
