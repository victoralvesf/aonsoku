import { getCurrentWindow } from '@tauri-apps/api/window'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  usePlayerIsPlaying,
  usePlayerMediaType,
  usePlayerSonglist,
} from '@/store/player.store'
import { appName } from '@/utils/appName'
import { logger } from '@/utils/logger'
import { isMac } from '@/utils/osType'
import { manageMediaSession } from '@/utils/setMediaSession'
import { isTauri } from '@/utils/tauriTools'

function setWindowTitle(title: string) {
  // Disabling this feature for macOS
  // due to a bug with traffic lights position
  if (!isTauri() || isMac) return

  getCurrentWindow()
    .setTitle(title)
    .then(() => {
      logger.info('[MediaSessionObserver] - Title updated to ->', title)
    })
}

export function MediaSessionObserver() {
  const { t } = useTranslation()
  const isPlaying = usePlayerIsPlaying()
  const { isRadio, isSong, isPodcast } = usePlayerMediaType()
  const { currentList, radioList, currentSongIndex, podcastList } =
    usePlayerSonglist()
  const radioLabel = t('radios.label')

  const song = currentList[currentSongIndex] ?? null
  const radio = radioList[currentSongIndex] ?? null
  const episode = podcastList[currentSongIndex] ?? null

  const hasNothingPlaying =
    currentList.length === 0 &&
    radioList.length === 0 &&
    podcastList.length === 0

  function resetAppTitle() {
    document.title = appName
    manageMediaSession.removeMediaSession()
    setWindowTitle(appName)
  }

  useEffect(() => {
    manageMediaSession.setPlaybackState(isPlaying)

    if (hasNothingPlaying || !isPlaying) {
      resetAppTitle()
      return
    }

    let title = ''

    if (isRadio && radio) {
      title = `${radioLabel} - ${radio.name}`
      manageMediaSession.setRadioMediaSession(radioLabel, radio.name)
    }
    if (isSong && song) {
      title = `${song.title} - ${song.artist}`
      manageMediaSession.setMediaSession(song)
    }
    if (isPodcast && episode) {
      title = `${episode.title} - ${episode.podcast.title}`
      manageMediaSession.setPodcastMediaSession(episode)
    }

    document.title = title
    setWindowTitle(title)
  }, [
    episode,
    hasNothingPlaying,
    isPlaying,
    isPodcast,
    isRadio,
    isSong,
    radio,
    radioLabel,
    song,
  ])

  return null
}
