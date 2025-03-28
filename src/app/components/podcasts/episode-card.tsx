import clsx from 'clsx'
import { CircleCheckIcon, PauseIcon, PlayIcon } from 'lucide-react'
import { ComponentPropsWithoutRef, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Link } from 'react-router-dom'
import { EqualizerBars } from '@/app/components/icons/equalizer-bars'
import { Button } from '@/app/components/ui/button'
import { Separator } from '@/app/components/ui/separator'
import {
  useEpisodeProgress,
  useEpisodeReleaseDate,
} from '@/app/hooks/use-episode-progress'
import {
  useIsEpisodePlaying,
  usePlayEpisode,
} from '@/app/hooks/use-podcast-playing'
import { ROUTES } from '@/routes/routesList'
import { Episode } from '@/types/responses/podcasts'
import { parseHtmlToText } from '@/utils/parseTexts'
import { PodcastActionButton } from './action-button'
import { PodcastActionOptions } from './action-options'

const MemoEpisodeImage = memo(EpisodeImage)
const MemoEpisodeCardInfo = memo(EpisodeCardInfo)
const MemoPodcastActionButton = memo(PodcastActionButton)
const MemoPodcastActionOptions = memo(PodcastActionOptions)
const MemoEpisodeProgress = memo(EpisodeProgress)

type EpisodeCardProps = ComponentPropsWithoutRef<'div'> & {
  episode: Episode
  latest?: boolean
}

export function EpisodeCard({
  episode,
  latest = false,
  ...rest
}: EpisodeCardProps) {
  return (
    <div className="group/row" {...rest}>
      <Link
        to={ROUTES.EPISODES.PAGE(episode.id)}
        className="flex gap-2 items-center px-4 py-3 rounded-lg max-w-full group-hover/row:bg-foreground/20"
      >
        <MemoEpisodeImage episode={episode} />
        <MemoEpisodeCardInfo episode={episode} />
        <div className="min-w-[14%] flex flex-col gap-1 items-center justify-center text-xs text-muted-foreground">
          <MemoEpisodeProgress episode={episode} />
        </div>
        <div className="min-w-16 flex items-center justify-end">
          <MemoPodcastActionButton>
            <MemoPodcastActionOptions episode={episode} latest={latest} />
          </MemoPodcastActionButton>
        </div>
      </Link>
      <div className="px-4">
        <Separator />
      </div>
    </div>
  )
}

export function EpisodeCardInfo({ episode }: EpisodeCardProps) {
  const { isPlaying, isEpisodePlaying } = useIsEpisodePlaying({
    id: episode.id,
  })

  const { episodeReleaseDate } = useEpisodeReleaseDate(episode.published_at)

  return (
    <div className="flex flex-col flex-1 space-y-1 min-w-64">
      <div className="flex gap-1 items-center max-h-4">
        {isEpisodePlaying && isPlaying && (
          <EqualizerBars size={14} className="text-muted-foreground mb-1" />
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
        {parseHtmlToText(episode.description)}
      </p>
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
    return (
      <div className="flex gap-1 items-center">
        <CircleCheckIcon className="w-4 h-4" />
        <span>{t('podcasts.list.progress.completed')}</span>
      </div>
    )
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

const MemoLazyLoadImage = memo(LazyLoadImage)
const MemoEpisodeImageButton = memo(EpisodeImageButton)

function EpisodeImage({ episode }: EpisodeCardProps) {
  return (
    <div
      className={clsx(
        'w-[100px] h-[100px] min-w-[100px] min-h-[100px]',
        'bg-skeleton aspect-square bg-cover bg-center',
        'rounded-md overflow-hidden border border-border',
        'shadow-custom-3 relative',
      )}
      onClick={(e) => {
        e.stopPropagation()
        e.preventDefault()
      }}
    >
      <MemoLazyLoadImage
        effect="opacity"
        src={episode.image_url}
        alt={episode.title}
        width="100%"
        height="100%"
        className="aspect-square object-cover w-full h-full"
      />
      <div className="w-full h-full absolute z-20 inset-0 flex items-center justify-center group/play cursor-pointer">
        <MemoEpisodeImageButton episodeId={episode.id} />
      </div>
    </div>
  )
}

export function EpisodeImageButton({ episodeId }: { episodeId: string }) {
  const { isPlaying, isEpisodePlaying, isNotPlaying } = useIsEpisodePlaying({
    id: episodeId,
  })
  const { handlePlayEpisode } = usePlayEpisode({ id: episodeId })

  return (
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
  )
}
