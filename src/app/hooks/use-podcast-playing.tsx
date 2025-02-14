import { MouseEvent, useCallback, useMemo } from 'react'
import { podcasts } from '@/service/podcasts'
import {
  usePlayerActions,
  usePlayerIsPlaying,
  usePlayerMediaType,
  usePlayerSonglist,
} from '@/store/player.store'

interface IEpisodeProps {
  id: string
}

export function useIsEpisodePlaying({ id }: IEpisodeProps) {
  const { podcastList } = usePlayerSonglist()
  const isPlaying = usePlayerIsPlaying()
  const { isPodcast } = usePlayerMediaType()

  const isEpisodePlaying = useMemo(() => {
    if (!isPodcast) return false

    const playingEpisode = podcastList[0]

    return playingEpisode.id === id
  }, [id, isPodcast, podcastList])

  return {
    isPlaying,
    isEpisodePlaying,
  }
}

export function usePlayEpisode({ id }: IEpisodeProps) {
  const { setPlayPodcast, setPlayingState } = usePlayerActions()
  const { isPlaying, isEpisodePlaying } = useIsEpisodePlaying({ id })

  const handlePlayEpisode = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      e.preventDefault()

      if (isPlaying && isEpisodePlaying) {
        setPlayingState(false)
        return
      }
      if (!isPlaying && isEpisodePlaying) {
        setPlayingState(true)
        return
      }

      const episodeWithPodcast = await podcasts.getEpisode(id)
      if (episodeWithPodcast) {
        const { playback } = episodeWithPodcast
        const hasPlaybackData = playback.length > 0
        let currentProgress = hasPlaybackData ? playback[0].progress : 0

        if (hasPlaybackData && playback[0].completed) {
          currentProgress = 0
        }

        setPlayPodcast([episodeWithPodcast], 0, currentProgress)
      }
    },
    [id, isEpisodePlaying, isPlaying, setPlayPodcast, setPlayingState],
  )

  return {
    handlePlayEpisode,
  }
}
