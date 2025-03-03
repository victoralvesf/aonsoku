import { getCoverArtUrl } from '@/api/httpClient'
import { EpisodeWithPodcast } from '@/types/responses/podcasts'
import { ISong } from '@/types/responses/song'

const artworkSizes = ['96', '128', '192', '256', '384', '512']

function removeMediaSession() {
  if (!navigator.mediaSession) return

  navigator.mediaSession.metadata = null
}

function setMediaSession(song: ISong) {
  if (!navigator.mediaSession) return

  navigator.mediaSession.metadata = new MediaMetadata({
    title: song.title,
    artist: song.artist,
    album: song.album,
    artwork: artworkSizes.map((size): MediaImage => {
      return {
        src: getCoverArtUrl(song.coverArt, 'song', size),
        sizes: [size, size].join('x'),
        type: 'image/jpeg',
      }
    }),
  })
}

function setPodcastMediaSession(episode: EpisodeWithPodcast) {
  if (!navigator.mediaSession) return

  navigator.mediaSession.metadata = new MediaMetadata({
    title: episode.title,
    album: episode.podcast.title,
    artist: episode.podcast.author,
    artwork: [
      {
        src: episode.image_url,
        sizes: '',
        type: 'image/jpeg',
      },
    ],
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
        type: '',
      },
    ],
  })
}

function setPlaybackState(state: boolean | null) {
  if (!navigator.mediaSession) return

  if (state === null) navigator.mediaSession.playbackState = 'none'

  if (state) {
    navigator.mediaSession.playbackState = 'playing'
  } else {
    navigator.mediaSession.playbackState = 'paused'
  }
}

interface SetHandlerParams {
  setIsPlaying: (value: boolean) => void
  playPrev: () => void
  playNext: () => void
}

function setHandlers({ setIsPlaying, playPrev, playNext }: SetHandlerParams) {
  const { mediaSession } = navigator
  if (!mediaSession) return

  mediaSession.setActionHandler('seekbackward', null)
  mediaSession.setActionHandler('seekforward', null)

  mediaSession.setActionHandler('play', () => setIsPlaying(true))
  mediaSession.setActionHandler('pause', () => setIsPlaying(false))
  mediaSession.setActionHandler('previoustrack', () => playPrev())
  mediaSession.setActionHandler('nexttrack', () => playNext())
}

interface SetPodcastHandlerParams {
  setIsPlaying: (value: boolean) => void
  seekBackward: (value: number) => void
  seekForward: (value: number) => void
}

function setPodcastHandlers({
  setIsPlaying,
  seekBackward,
  seekForward,
}: SetPodcastHandlerParams) {
  const { mediaSession } = navigator
  if (!mediaSession) return

  mediaSession.setActionHandler('previoustrack', null)
  mediaSession.setActionHandler('nexttrack', null)

  mediaSession.setActionHandler('play', () => setIsPlaying(true))
  mediaSession.setActionHandler('pause', () => setIsPlaying(false))
  mediaSession.setActionHandler('seekbackward', () => seekBackward(-15))
  mediaSession.setActionHandler('seekforward', () => seekForward(30))
}

export const manageMediaSession = {
  removeMediaSession,
  setMediaSession,
  setRadioMediaSession,
  setPodcastMediaSession,
  setPlaybackState,
  setHandlers,
  setPodcastHandlers,
}
