import clsx from 'clsx'
import { EllipsisVertical, PauseIcon, PlayIcon } from 'lucide-react'
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
import { useEpisodeProgress } from '@/app/hooks/use-episode-progress'
import { useIsEpisodePlaying } from '@/app/hooks/use-podcast-playing'
import { ROUTES } from '@/routes/routesList'
import { podcasts } from '@/service/podcasts'
import { usePlayerActions } from '@/store/player.store'
import { Episode } from '@/types/responses/podcasts'
import dateTime from '@/utils/dateTime'
import { parseDescription } from '@/utils/parseTexts'
import { EqualizerBars } from '../icons/equalizer-bars'

type EpisodeCardProps = ComponentPropsWithoutRef<'div'> & {
  episode: Episode
}

export function EpisodeCard({ episode, ...rest }: EpisodeCardProps) {
  const { t } = useTranslation()
  const { isPlaying, isEpisodePlaying } = useIsEpisodePlaying({
    id: episode.id,
  })

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

  return (
    <div className="group/row" {...rest}>
      <Link
        to={ROUTES.EPISODES.PAGE(episode.id)}
        className="flex gap-2 items-center px-4 py-3 rounded-lg max-w-full group-hover/row:bg-foreground/20"
      >
        <EpisodeImage episode={episode} />
        <div className="flex flex-col flex-1 space-y-1 min-w-64">
          <div className="flex gap-1 items-center">
            {isEpisodePlaying && isPlaying && (
              <EqualizerBars
                width={14}
                height={14}
                className="text-muted-foreground mb-[2px]"
              />
            )}
            <span className="text-xs text-muted-foreground font-medium uppercase w-fit">
              {episodeReleaseDate}
            </span>
          </div>
          <h4
            className={clsx(
              'text-sm font-medium w-fit max-w-full truncate',
              isEpisodePlaying && 'text-primary',
            )}
          >
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

  const {
    episodeDuration,
    hasPlaybackData,
    isEpisodeCompleted,
    remainingTimeText,
    listeningProgressPercentage,
  } = useEpisodeProgress({ duration, playback })

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

function EpisodeImage({ episode }: EpisodeCardProps) {
  const { setPlayPodcast, setPlayingState } = usePlayerActions()
  const { isPlaying, isEpisodePlaying } = useIsEpisodePlaying({
    id: episode.id,
  })

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

      const episodeWithPodcast = await podcasts.getEpisode(episode.id)
      if (episodeWithPodcast) {
        const { playback } = episodeWithPodcast
        const hasPlaybackData = playback.length > 0
        let currentProgress = hasPlaybackData ? playback[0].progress : 0

        if (hasPlaybackData && playback[0].completed) {
          currentProgress = 0
        }

        setPlayPodcast([episodeWithPodcast], 0, currentProgress)
      }
    },
    [episode.id, isEpisodePlaying, isPlaying, setPlayPodcast, setPlayingState],
  )

  const isNotPlaying = useMemo(() => {
    return (isEpisodePlaying && !isPlaying) || !isEpisodePlaying
  }, [isEpisodePlaying, isPlaying])

  return (
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
          className="rounded-full bg-background/60 backdrop-blur-md opacity-0 group-hover/row:opacity-100 transition-opacity group-hover/play:bg-background"
          onClick={handlePlayEpisode}
        >
          {isEpisodePlaying && isPlaying && (
            <PauseIcon className="w-4 h-4 fill-foreground" />
          )}
          {isNotPlaying && <PlayIcon className="w-4 h-4 fill-foreground" />}
        </Button>
      </div>
    </div>
  )
}
