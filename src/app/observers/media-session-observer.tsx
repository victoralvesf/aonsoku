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

  const song = currentList[currentSongIndex] ?? null
  const radio = radioList[currentSongIndex] ?? null
  const episode = podcastList[currentSongIndex] ?? null

  const hasNothingPlaying =
    currentList.length === 0 &&
    radioList.length === 0 &&
    podcastList.length === 0

  function resetAppTitle() {
    document.title = appName
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
