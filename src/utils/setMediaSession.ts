import { getCoverArtUrl } from "@/api/httpClient";
import { ISong } from "@/types/responses/song";

const artworkSizes = [
  '96',
  '128',
  '192',
  '256',
  '384',
  '512',
]

function setMediaSession(song: ISong) {
  if (!navigator.mediaSession) return

  navigator.mediaSession.metadata = new MediaMetadata({
    title: song.title,
    artist: song.artist,
    album: song.album,
    artwork: artworkSizes.map((size): MediaImage => {
      return {
        src: getCoverArtUrl(song.coverArt, size),
        sizes: [size, size].join('x'),
        type: 'image/jpeg'
      }
    })
  })
}

async function setRadioMediaSession(label: string, radioName: string) {
  if (!navigator.mediaSession) return

  navigator.mediaSession.metadata = new MediaMetadata({
    title: radioName,
    artist: label,
    album: '',
    artwork: [
      {
        src: '',
        sizes: '',
        type: ''
      }
    ]
  })
}

function setPlaybackState(state: boolean | null) {
  if (!navigator.mediaSession.playbackState) return

  if (state === null) navigator.mediaSession.playbackState = 'none'

  if (state) {
    navigator.mediaSession.playbackState = 'playing'
  } else {
    navigator.mediaSession.playbackState = 'paused'
  }
}

interface SetHandlerParams {
  togglePlayPause: () => void
  playPrev: () => void
  playNext: () => void
}

function setHandlers({ playPrev, playNext, togglePlayPause }: SetHandlerParams) {
  if (!navigator.mediaSession) return

  navigator.mediaSession.setActionHandler("play", () => togglePlayPause())
  navigator.mediaSession.setActionHandler("pause", () => togglePlayPause())
  navigator.mediaSession.setActionHandler("previoustrack", () => playPrev());
  navigator.mediaSession.setActionHandler("nexttrack", () => playNext());
}

export const manageMediaSession = {
  setMediaSession,
  setRadioMediaSession,
  setPlaybackState,
  setHandlers
}
