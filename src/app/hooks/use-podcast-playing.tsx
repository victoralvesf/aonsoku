import { useMemo } from 'react'
import {
  usePlayerIsPlaying,
  usePlayerMediaType,
  usePlayerSonglist,
} from '@/store/player.store'

interface UseIsEpisodePlayingProps {
  id: string
}

export function useIsEpisodePlaying({ id }: UseIsEpisodePlayingProps) {
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
