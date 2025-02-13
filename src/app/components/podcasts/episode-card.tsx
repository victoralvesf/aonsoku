import clsx from 'clsx'
import { EllipsisVertical, PlayIcon } from 'lucide-react'
import {
  ComponentPropsWithoutRef,
  MouseEvent,
  useCallback,
  useMemo,
} from 'react'
import { useTranslation } from 'react-i18next'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Link } from 'react-router-dom'
import { Button } from '@/app/components/ui/button'
import { Separator } from '@/app/components/ui/separator'
import { ROUTES } from '@/routes/routesList'
import { podcasts } from '@/service/podcasts'
import { usePlayerActions } from '@/store/player.store'
import { Episode } from '@/types/responses/podcasts'
import { convertSecondsToHumanRead } from '@/utils/convertSecondsToTime'
import dateTime from '@/utils/dateTime'
import { parseDescription } from '@/utils/parseTexts'

type EpisodeCardProps = ComponentPropsWithoutRef<'div'> & {
  episode: Episode
}

export function EpisodeCard({ episode, ...rest }: EpisodeCardProps) {
  const { t } = useTranslation()
  const { setPlayPodcast } = usePlayerActions()

  const episodeReleaseDate = useMemo(() => {
    const today = dateTime()
    const targetDate = dateTime(episode.published_at)
    const diffInDays = today.diff(targetDate, 'days')

    if (today.year() !== targetDate.year()) {
      return targetDate.format('L')
    }

    if (diffInDays > 15) {
      return targetDate.format('DD MMM')
    }

    const parsed = dateTime().from(targetDate, true)
    return t('table.lastPlayed', { date: parsed })
  }, [episode.published_at, t])

  const handlePlayEpisode = useCallback(
    async (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation()
      e.preventDefault()

      const episodeWithPodcast = await podcasts.getEpisode(episode.id)
      if (episodeWithPodcast) setPlayPodcast([episodeWithPodcast], 0)
    },
    [episode.id, setPlayPodcast],
  )

  return (
    <div className="group/row" {...rest}>
      <Link
        to={ROUTES.EPISODES.PAGE(episode.id)}
        className="flex gap-2 items-center px-4 py-3 rounded-lg max-w-full group-hover/row:bg-foreground/20"
      >
        <div
          className={clsx(
            'w-[100px] h-[100px] min-w-[100px] min-h-[100px]',
            'bg-skeleton aspect-square bg-cover bg-center',
            'rounded-md overflow-hidden border border-border',
            'shadow-[0_0_3px_rgba(255,255,255,0.03)] relative',
          )}
          onClick={(e) => {
            e.stopPropagation()
            e.preventDefault()
          }}
        >
          <LazyLoadImage
            effect="opacity"
            src={episode.image_url}
            alt={episode.title}
            width="100%"
            height="100%"
            className="aspect-square object-cover w-full h-full"
          />
          <div className="w-full h-full absolute z-20 inset-0 flex items-center justify-center group/play cursor-pointer">
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full bg-background/20 backdrop-blur-md opacity-0 group-hover/row:opacity-100 transition-opacity group-hover/play:bg-background"
              onClick={handlePlayEpisode}
            >
              <PlayIcon className="w-4 h-4 fill-foreground" />
            </Button>
          </div>
        </div>
        <div className="flex flex-col flex-1 space-y-1 min-w-64">
          <span className="text-xs text-muted-foreground font-medium uppercase w-fit">
            {episodeReleaseDate}
          </span>
          <h4 className="text-sm font-medium w-fit max-w-full truncate">
            {episode.title}
          </h4>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {parseDescription(episode.description)}
          </p>
        </div>
        <div className="min-w-[14%] flex flex-col gap-1 items-center justify-center text-xs text-muted-foreground">
          <EpisodeProgress episode={episode} />
        </div>
        <div className="min-w-16 flex items-center justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-background rounded-full"
            onClick={(e) => {
              e.stopPropagation()
              e.preventDefault()
            }}
          >
            <EllipsisVertical className="w-4 h-4" />
          </Button>
        </div>
      </Link>
      <div className="px-4">
        <Separator />
      </div>
    </div>
  )
}

function EpisodeProgress({ episode }: EpisodeCardProps) {
  const { t } = useTranslation()
  const { duration, playback } = episode

  const episodeDuration = convertSecondsToHumanRead(duration)

  const hasPlaybackData = episode.playback.length === 1
  const isEpisodeCompleted = hasPlaybackData ? playback[0].completed : false

  const remainingTime = hasPlaybackData ? duration - playback[0].progress : 0
  const remainingTimeText = convertSecondsToHumanRead(remainingTime)

  const listeningProgress = hasPlaybackData ? playback[0].progress : 0
  const listeningProgressPercentage = (listeningProgress / duration) * 100

  if (!hasPlaybackData) {
    return <span>{episodeDuration}</span>
  }

  if (isEpisodeCompleted) {
    return <span>{t('podcasts.list.progress.completed')}</span>
  }

  return (
    <>
      <span>
        {t('podcasts.list.progress.remainingTime', { time: remainingTimeText })}
      </span>
      <div className="w-3/6 h-1 rounded-full relative bg-secondary overflow-hidden">
        <div
          className="absolute z-10 bg-primary h-full"
          style={{ width: `${listeningProgressPercentage}%` }}
        />
      </div>
    </>
  )
}
