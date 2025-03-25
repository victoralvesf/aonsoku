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
import { manageMediaSession } from '@/utils/setMediaSession'
import { isTauri } from '@/utils/tauriTools'

function setWindowTitle(title: string) {
  if (!isTauri()) return

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

  const hasSongsPlaying = currentList.length > 0
  const hasRadiosPlaying = radioList.length > 0
  const hasPodcastsPlaying = podcastList.length > 0

  const song = currentList[currentSongIndex] ?? null
  const radio = radioList[currentSongIndex] ?? null
  const episode = podcastList[currentSongIndex] ?? null

  const hasNothingPlaying =
    !hasSongsPlaying && !hasRadiosPlaying && !hasPodcastsPlaying

  useEffect(() => {
    if (hasNothingPlaying) {
      document.title = appName
      manageMediaSession.removeMediaSession()
      setWindowTitle(appName)
    }
  }, [hasNothingPlaying])

  useEffect(() => {
    if (isRadio && hasRadiosPlaying) {
      const title = `${radioLabel} - ${radio.name}`
      document.title = `${title} - ${appName}`
      manageMediaSession.setRadioMediaSession(radioLabel, radio.name)
      setWindowTitle(title)
    }
  }, [hasRadiosPlaying, isRadio, radio, radioLabel])

  useEffect(() => {
    if (isSong && hasSongsPlaying) {
      const title = `${song.title} - ${song.artist}`
      document.title = `${title} - ${appName}`
      manageMediaSession.setMediaSession(song)
      setWindowTitle(title)
    }
  }, [hasSongsPlaying, isSong, song])

  useEffect(() => {
    if (isPodcast && hasPodcastsPlaying) {
      const title = `${episode.title} - ${episode.podcast.title}`
      document.title = `${title} - ${appName}`
      manageMediaSession.setPodcastMediaSession(episode)
      setWindowTitle(title)
    }
  }, [episode, hasPodcastsPlaying, hasSongsPlaying, isPodcast, isSong, song])

  useEffect(() => {
    manageMediaSession.setPlaybackState(isPlaying)
  }, [isPlaying])

  return null
}
