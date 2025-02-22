import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Playback } from '@/types/responses/podcasts'
import { convertSecondsToHumanRead } from '@/utils/convertSecondsToTime'
import dateTime from '@/utils/dateTime'

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

export function useEpisodeReleaseDate(publishedAt: string) {
  const { t } = useTranslation()

  const formatReleaseDate = useCallback(() => {
    const today = dateTime()
    const targetDate = dateTime(publishedAt)
    const diffInDays = today.diff(targetDate, 'days')

    if (today.year() !== targetDate.year()) {
      return targetDate.format('L')
    }

    if (diffInDays > 15) {
      return targetDate.format('DD MMM')
    }

    const parsed = dateTime().from(targetDate, true)
    return t('table.lastPlayed', { date: parsed })
  }, [publishedAt, t])

  const episodeReleaseDate = formatReleaseDate()

  return {
    episodeReleaseDate,
  }
}
