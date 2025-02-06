import { useMemo } from 'react'
import { Separator } from '@/app/components/ui/separator'
import { ROUTES } from '@/routes/routesList'
import { EpisodeWithPodcast } from '@/types/responses/podcasts'
import { convertSecondsToHumanRead } from '@/utils/convertSecondsToTime'
import dateTime from '@/utils/dateTime'
import { PodcastInfoContainer } from './info/container'
import { PodcastInfoImage } from './info/image'
import { Root, Title, SubtitleLink, Details } from './info/texts'

interface EpisodeInfoProps {
  episode: EpisodeWithPodcast
}

export function EpisodeInfo({ episode }: EpisodeInfoProps) {
  const publishDate = useMemo(() => {
    return dateTime(episode.published_at).format('LL')
  }, [episode.published_at])

  const episodeDuration = useMemo(() => {
    return convertSecondsToHumanRead(episode.duration)
  }, [episode.duration])

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
          <Details.Dot />
          <Details.Text>{episodeDuration}</Details.Text>
        </Details.Root>
      </Root>
    </PodcastInfoContainer>
  )
}
