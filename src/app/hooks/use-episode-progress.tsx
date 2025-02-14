import { Playback } from '@/types/responses/podcasts'
import { convertSecondsToHumanRead } from '@/utils/convertSecondsToTime'

interface UseEpisodeProgressProps {
  duration: number
  playback: Playback[]
  showFullTime?: boolean
}

export function useEpisodeProgress({
  duration,
  playback,
  showFullTime = false,
}: UseEpisodeProgressProps) {
  const episodeDuration = convertSecondsToHumanRead(duration, showFullTime)

  const hasPlaybackData = playback.length === 1
  const isEpisodeCompleted = hasPlaybackData ? playback[0].completed : false

  const remainingTime = hasPlaybackData ? duration - playback[0].progress : 0
  const remainingTimeText = convertSecondsToHumanRead(
    remainingTime,
    showFullTime,
  )

  const listeningProgress = hasPlaybackData ? playback[0].progress : 0
  const listeningProgressPercentage = (listeningProgress / duration) * 100

  return {
    episodeDuration,
    hasPlaybackData,
    isEpisodeCompleted,
    remainingTime,
    remainingTimeText,
    listeningProgress,
    listeningProgressPercentage,
  }
}
