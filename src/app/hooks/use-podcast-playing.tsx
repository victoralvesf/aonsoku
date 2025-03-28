import { MouseEvent, useCallback, useMemo } from 'react'
import { podcasts } from '@/service/podcasts'
import {
  usePlayerActions,
  usePlayerIsPlaying,
  usePlayerMediaType,
  usePlayerSonglist,
} from '@/store/player.store'
import { getEpisodePlayProgress } from './use-episode-progress'

interface IEpisodeProps {
  id: string
}

export function useIsEpisodePlaying({ id }: IEpisodeProps) {
  const { podcastList, currentSongIndex } = usePlayerSonglist()
  const isPlaying = usePlayerIsPlaying()
  const { isPodcast } = usePlayerMediaType()

  const isEpisodePlaying = useMemo(() => {
    if (!isPodcast) return false

    const playingEpisode = podcastList[currentSongIndex] ?? null
    if (!playingEpisode) return false

    return playingEpisode.id === id
  }, [currentSongIndex, id, isPodcast, podcastList])

  const isNotPlaying = useMemo(() => {
    return (isEpisodePlaying && !isPlaying) || !isEpisodePlaying
  }, [isEpisodePlaying, isPlaying])

  return {
    isPlaying,
    isEpisodePlaying,
    isNotPlaying,
  }
}

export async function getAndFormatEpisode(id: string) {
  const episode = await podcasts.getEpisode(id)
  if (episode) {
    // Remove descriptions to avoid storing large texts
    episode.description = ''
    episode.podcast.description = ''

    const { playback } = episode
    const progress = getEpisodePlayProgress({ playback })

    return {
      episode,
      progress,
    }
  }

  return {
    episode: null,
    progress: 0,
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

      const { episode, progress } = await getAndFormatEpisode(id)
      if (episode) {
        setPlayPodcast([episode], 0, progress)
      }
    },
    [id, isEpisodePlaying, isPlaying, setPlayPodcast, setPlayingState],
  )

  return {
    handlePlayEpisode,
  }
}

export function useEpisodeQueue({ id }: IEpisodeProps) {
  const { setNextPodcast, setLastPodcast } = usePlayerActions()

  const handlePlayNext = useCallback(async () => {
    const { episode, progress } = await getAndFormatEpisode(id)
    if (episode) {
      setNextPodcast(episode, progress)
    }
  }, [id, setNextPodcast])

  const handlePlayLast = useCallback(async () => {
    const { episode, progress } = await getAndFormatEpisode(id)
    if (episode) {
      setLastPodcast(episode, progress)
    }
  }, [id, setLastPodcast])

  return {
    handlePlayNext,
    handlePlayLast,
  }
}
