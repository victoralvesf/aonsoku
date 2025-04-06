import { GlobeIcon, RssIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Dot } from '@/app/components/dot'
import { Separator } from '@/app/components/ui/separator'
import { Podcast } from '@/types/responses/podcasts'
import { parseHtmlToText } from '@/utils/parseTexts'
import { PodcastInfoContainer } from './info/container'
import { PodcastInfoImage } from './info/image'
import { Root, Title, Subtitle, Description, Details } from './info/texts'
import { UnfollowButton } from './unfollow-button'

interface PodcastInfoProps {
  podcast: Podcast
}

export function PodcastInfo({ podcast }: PodcastInfoProps) {
  const { t } = useTranslation()

  return (
    <PodcastInfoContainer>
      <PodcastInfoImage src={podcast.image_url} alt={podcast.title} />

      <Root>
        <div className="flex gap-3 items-center">
          <Title>{podcast.title}</Title>
          <UnfollowButton title={podcast.title} podcastId={podcast.id} />
        </div>
        <Subtitle>{podcast.author}</Subtitle>
        <Separator />
        <Description>{parseHtmlToText(podcast.description)}</Description>
        <Details.Root>
          <Details.Text>
            {t('podcasts.header.episodeCount', {
              count: podcast.episode_count,
            })}
          </Details.Text>
          <Dot />
          <Details.Link href={podcast.feed_url}>
            <RssIcon className="w-4 h-4" />
            {t('podcasts.header.feed')}
          </Details.Link>
          {podcast.link && (
            <>
              <Dot />
              <Details.Link href={podcast.link}>
                <GlobeIcon className="w-4 h-4" />
                {t('podcasts.header.website')}
              </Details.Link>
            </>
          )}
        </Details.Root>
      </Root>
    </PodcastInfoContainer>
  )
}
