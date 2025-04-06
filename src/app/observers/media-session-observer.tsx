import { emit } from '@tauri-apps/api/event'
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

function setWindowTitle(newTitle: string) {
  if (!isTauri()) return

  // On macOS, the positioning of the traffic light buttons (close, minimize, maximize)
  // imposes certain limitations on window management. To ensure proper functionality,
  // the window title must be set on the Rust side within the custom macOS window handler
  // plugin located at: [src-tauri/src/mac].
  if (isMac) {
    emit('aonsoku_title_changed', newTitle)
      .then(() => {
        logger.info(
          '[MediaSessionObserver] (macOS) - Title updated to ->',
          newTitle,
        )
      })
      .catch((error) => {
        logger.error(
          '[MediaSessionObserver] (macOS) - Error updating window title:',
          error,
        )
      })
  } else {
    getCurrentWindow()
      .setTitle(newTitle)
      .then(() => {
        logger.info('[MediaSessionObserver] - Title updated to ->', newTitle)
      })
      .catch((error) => {
        logger.error(
          '[MediaSessionObserver] - Error updating window title:',
          error,
        )
      })
  }
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
    setWindowTitle(appName)
  }

  useEffect(() => {
    manageMediaSession.setPlaybackState(isPlaying)

    if (hasNothingPlaying) {
      manageMediaSession.removeMediaSession()
    }

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
      title = `${song.artist} - ${song.title}`
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
