import { getSimpleCoverArtUrl } from '@/api/httpClient'
import { useAppStore } from '@/store/app.store'
import { usePlayerStore } from '@/store/player.store'
import { ISong } from '@/types/responses/song'
import { isDesktop } from './desktop'

async function fetchPublicArtwork(artist: string, album: string): Promise<string | null> {
  try {
    const query = encodeURIComponent(`${artist} ${album}`)
    const response = await fetch(`https://itunes.apple.com/search?term=${query}&entity=album&limit=1`)
    const data = await response.json()
    if (data.results && data.results[0]) {
      return data.results[0].artworkUrl100.replace('100x100bb', '512x512bb')
    }
  } catch (e) {
    console.warn('Discord RPC: Failed to fetch public artwork', e)
  }
  return null
}

async function send(song: ISong, currentTime = 0, duration = 0) {
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

  // Try to get a public URL for Discord to proxy/cache
  const publicImageUrl = await fetchPublicArtwork(artist, song.album)
  const imageUrl = publicImageUrl || getSimpleCoverArtUrl(song.coverArt, 'song', '512')

  window.api.setDiscordRpcActivity({
    trackName: song.title,
    albumName: song.album,
    artist,
    startTime,
    endTime,
    duration,
    imageUrl,
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
