import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { useTranslation } from 'react-i18next'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Link, useParams } from 'react-router-dom'
import { Actions } from '@/app/components/actions'
import { AlbumFallback } from '@/app/components/fallbacks/album-fallbacks'
import ListWrapper from '@/app/components/list-wrapper'
import { Separator } from '@/app/components/ui/separator'
import { ROUTES } from '@/routes/routesList'
import { podcasts } from '@/service/podcasts'
import { convertSecondsToHumanRead } from '@/utils/convertSecondsToTime'
import dateTime from '@/utils/dateTime'
import { linkifyText, sanitizeLinks } from '@/utils/parseTexts'

export default function Episode() {
  const { episodeId } = useParams() as { episodeId: string }
  const { t } = useTranslation()

  const { data: episode, isLoading } = useQuery({
    queryKey: ['get-episode', episodeId],
    queryFn: () => podcasts.getEpisode(episodeId),
  })

  if (isLoading) return <AlbumFallback />
  if (!episode) return <AlbumFallback />

  function formatDescription(text: string) {
    const parsed = sanitizeLinks(text)
    const final = linkifyText(parsed)

    return { __html: final }
  }

  return (
    <div className="h-full">
      <div className="w-full px-8 pt-6 flex gap-4">
        <div
          className={clsx(
            'w-[200px] h-[200px] min-w-[200px] min-h-[200px]',
            '2xl:w-[250px] 2xl:h-[250px] 2xl:min-w-[250px] 2xl:min-h-[250px]',
            'bg-skeleton aspect-square bg-cover bg-center rounded',
            'shadow-[0_0_5px_rgba(255,255,255,0.05)] border border-border overflow-hidden',
          )}
        >
          <LazyLoadImage
            src={episode.image_url}
            alt={episode.title}
            effect="opacity"
            className="aspect-square object-cover w-full h-full"
            width="100%"
            height="100%"
          />
        </div>

        <div className="flex w-full flex-col justify-end space-y-2">
          <h1 className="tracking-tight font-bold text-4xl leading-snug -mb-1 antialiased drop-shadow-md line-clamp-2">
            {episode.title}
          </h1>
          <Link
            to={ROUTES.PODCASTS.PAGE(episode.podcast_id)}
            className="text-lg font-medium text-muted-foreground hover:underline"
          >
            {episode.podcast.title}
          </Link>
          <Separator />
          <div className="flex gap-1 text-muted-foreground text-sm">
            <span>{dateTime(episode.published_at).format('LL')}</span>
            <span className="mx-1 opacity-80">•</span>
            <span>{convertSecondsToHumanRead(episode.duration)}</span>
          </div>
        </div>
      </div>

      <ListWrapper>
        <Actions.Container>
          <Actions.Button
            tooltip={t('playlist.buttons.play', { name: episode.title })}
            buttonStyle="primary"
            onClick={() => {}}
          >
            <Actions.PlayIcon />
          </Actions.Button>
        </Actions.Container>

        <div
          dangerouslySetInnerHTML={formatDescription(episode.description)}
          className="html leading-relaxed max-w-full"
        />
      </ListWrapper>
    </div>
  )
}
