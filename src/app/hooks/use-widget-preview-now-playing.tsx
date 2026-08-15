import { useTranslation } from 'react-i18next'
import { getSimpleCoverArtUrl } from '@/api/httpClient'
import { usePlayerStore } from '@/store/player.store'
import { WidgetNowPlayingPayload } from '@/types/widget'

export function usePreviewNowPlaying(): WidgetNowPlayingPayload {
  const { t } = useTranslation()
  const currentSong = usePlayerStore((state) => state.songlist.currentSong)

  // The store seeds `currentSong` with an empty object, so only an id proves a
  // song was actually loaded.
  if (!currentSong?.id) {
    return {
      isPlaying: true,
      title: t('settings.widget.profile.preview.title'),
      artist: t('settings.widget.profile.preview.artist'),
      album: t('settings.widget.profile.preview.album'),
      coverArtUrl: '/default_album_art.png',
      duration: 214,
      position: 76,
      updatedAt: Date.now(),
    }
  }

  const artist = currentSong.artists
    ? currentSong.artists.map((item) => item.name).join(', ')
    : currentSong.artist

  return {
    isPlaying: true,
    title: currentSong.title,
    artist,
    album: currentSong.album,
    coverArtUrl: getSimpleCoverArtUrl(currentSong.coverArt, 'album', '300'),
    duration: currentSong.duration,
    position: Math.floor(currentSong.duration * 0.35),
    updatedAt: Date.now(),
  }
}
