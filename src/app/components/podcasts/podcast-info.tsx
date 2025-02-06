import { GlobeIcon, RssIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Separator } from '@/app/components/ui/separator'
import { Podcast } from '@/types/responses/podcasts'
import { parseDescription } from '@/utils/parseTexts'
import { PodcastInfoContainer } from './info/container'
import { PodcastInfoImage } from './info/image'
import { Root, Title, Subtitle, Description, Details } from './info/texts'

interface PodcastInfoProps {
  podcast: Podcast
}

export function PodcastInfo({ podcast }: PodcastInfoProps) {
  const { t } = useTranslation()

  return (
    <PodcastInfoContainer>
      <PodcastInfoImage src={podcast.image_url} alt={podcast.title} />

      <Root>
        <Title>{podcast.title}</Title>
        <Subtitle>{podcast.author}</Subtitle>
        <Separator />
        <Description>{parseDescription(podcast.description)}</Description>
        <Details.Root>
          <Details.Text>
            {t('podcasts.header.episodeCount', {
              count: podcast.episode_count,
            })}
          </Details.Text>
          <Details.Dot />
          <Details.Link href={podcast.feed_url}>
            <RssIcon className="w-4 h-4" />
            {t('podcasts.header.feed')}
          </Details.Link>
          {podcast.link && (
            <>
              <Details.Dot />
              <Details.Link href={podcast.feed_url}>
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
