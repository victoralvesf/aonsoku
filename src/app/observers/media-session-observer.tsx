import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import {
  usePlayerIsPlaying,
  usePlayerMediaType,
  usePlayerSonglist,
} from '@/store/player.store'
import { appName } from '@/utils/appName'
import { manageMediaSession } from '@/utils/setMediaSession'

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
    }
  }, [hasNothingPlaying])

  useEffect(() => {
    if (isRadio && hasRadiosPlaying) {
      document.title = `${radioLabel} - ${radio.name} - ${appName}`
      manageMediaSession.setRadioMediaSession(radioLabel, radio.name)
    }
  }, [hasRadiosPlaying, isRadio, radio, radioLabel])

  useEffect(() => {
    if (isSong && hasSongsPlaying) {
      document.title = `${song.title} - ${song.artist} - ${appName}`
      manageMediaSession.setMediaSession(song)
    }
  }, [hasSongsPlaying, isSong, song])

  useEffect(() => {
    if (isPodcast && hasPodcastsPlaying) {
      document.title = `${episode.title} - ${episode.podcast.title} - ${appName}`
      manageMediaSession.setPodcastMediaSession(episode)
    }
  }, [episode, hasPodcastsPlaying, hasSongsPlaying, isPodcast, isSong, song])

  useEffect(() => {
    manageMediaSession.setPlaybackState(isPlaying)
  }, [isPlaying])

  return null
}
