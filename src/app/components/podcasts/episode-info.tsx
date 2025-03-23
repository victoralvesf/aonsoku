import { useTranslation } from 'react-i18next'
import { Dot } from '@/app/components/dot'
import { Separator } from '@/app/components/ui/separator'
import { useEpisodeProgress } from '@/app/hooks/use-episode-progress'
import { ROUTES } from '@/routes/routesList'
import { EpisodeWithPodcast } from '@/types/responses/podcasts'
import dateTime from '@/utils/dateTime'
import { PodcastInfoContainer } from './info/container'
import { PodcastInfoImage } from './info/image'
import { Root, Title, SubtitleLink, Details } from './info/texts'

interface EpisodeInfoProps {
  episode: EpisodeWithPodcast
}

export function EpisodeInfo({ episode }: EpisodeInfoProps) {
  const publishDate = dateTime(episode.published_at).format('LL')

  return (
    <PodcastInfoContainer>
      <PodcastInfoImage src={episode.image_url} alt={episode.title} />

      <Root>
        <Title>{episode.title}</Title>
        <SubtitleLink to={ROUTES.PODCASTS.PAGE(episode.podcast_id)}>
          {episode.podcast.title}
        </SubtitleLink>
        <Separator />
        <Details.Root>
          <Details.Text>{publishDate}</Details.Text>
          <Dot />
          <EpisodeProgress episode={episode} />
        </Details.Root>
      </Root>
    </PodcastInfoContainer>
  )
}

function EpisodeProgress({ episode }: EpisodeInfoProps) {
  const { t } = useTranslation()
  const { duration, playback } = episode

  const {
    episodeDuration,
    hasPlaybackData,
    isEpisodeCompleted,
    remainingTimeText,
  } = useEpisodeProgress({ duration, playback, showFullTime: true })

  if (!hasPlaybackData) {
    return <Details.Text>{episodeDuration}</Details.Text>
  }

  if (isEpisodeCompleted) {
    return <Details.Text>{t('podcasts.list.progress.completed')}</Details.Text>
  }

  return (
    <Details.Text>
      {t('podcasts.list.progress.remainingTime', { time: remainingTimeText })}
    </Details.Text>
  )
}
