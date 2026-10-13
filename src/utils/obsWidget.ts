import { getSimpleCoverArtUrl } from '@/api/httpClient'
import { usePlayerStore } from '@/store/player.store'
import { useWidgetStore } from '@/store/widget.store'
import { ISong } from '@/types/responses/song'
import { WidgetNowPlayingPayload } from '@/types/widget'
import { isDesktop } from './desktop'

// Everything but `position` only reaches the main process when it actually
// changes, and `position` is collapsed to whole seconds — otherwise every
// progress tick would fan out to the SSE stream.
let lastSignature = ''

function signatureOf(payload: WidgetNowPlayingPayload) {
  return [
    payload.isPlaying,
    payload.title,
    payload.artist,
    payload.album,
    payload.coverArtUrl,
    payload.duration,
    Math.floor(payload.position),
  ].join('|')
}

function send(song: ISong, currentTime = 0, duration = 0, isPlaying = false) {
  if (!isDesktop()) return

  const artist = song.artists
    ? song.artists.map((item) => item.name).join(', ')
    : song.artist

  const coverArtUrl = getSimpleCoverArtUrl(song.coverArt, 'album', '300')

  const payload: WidgetNowPlayingPayload = {
    isPlaying,
    title: song.title,
    artist,
    album: song.album,
    coverArtUrl,
    duration,
    position: currentTime,
    updatedAt: Date.now(),
  }

  const signature = signatureOf(payload)
  if (signature === lastSignature) return
  lastSignature = signature

  window.api.updateWidgetNowPlaying(payload)
}

function clear() {
  if (!isDesktop()) return

  const payload: WidgetNowPlayingPayload = {
    isPlaying: false,
    title: '',
    artist: '',
    duration: 0,
    position: 0,
    updatedAt: Date.now(),
  }

  const signature = signatureOf(payload)
  if (signature === lastSignature) return
  lastSignature = signature

  window.api.updateWidgetNowPlaying(payload)
}

function sendCurrentSong() {
  if (!isDesktop()) return

  const { enabled } = useWidgetStore.getState().data
  if (!enabled) return

  const { playerState, songlist, actions } = usePlayerStore.getState()

  // v1 mirrors the Discord RPC guard: radio and podcast playback simply keeps
  // the last known song on screen instead of pushing an unsupported state.
  const { mediaType } = playerState
  if (mediaType !== 'song') return

  const { currentSong } = songlist

  // The store seeds `currentSong` with an empty object, so only an id proves a
  // song was actually loaded — without this the widget would show a blank card.
  if (!currentSong?.id) {
    clear()
    return
  }

  const { isPlaying, currentDuration } = playerState
  const currentTime = actions.getCurrentProgress()

  send(currentSong, currentTime, currentDuration, isPlaying)
}

export const obsWidget = {
  send,
  clear,
  sendCurrentSong,
}
