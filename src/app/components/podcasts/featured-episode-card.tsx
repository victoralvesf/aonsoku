import clsx from 'clsx'
import { CircleCheckIcon, PauseIcon, PlayIcon } from 'lucide-react'
import { ComponentPropsWithoutRef, memo } from 'react'
import { useTranslation } from 'react-i18next'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Link } from 'react-router-dom'
import { EqualizerBars } from '@/app/components/icons/equalizer-bars'
import { Button } from '@/app/components/ui/button'
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

const MemoLazyLoadImage = memo(LazyLoadImage)

interface FeaturedEpisodeCardProps {
  episode: Episode
}

export function FeaturedEpisodeCard({ episode }: FeaturedEpisodeCardProps) {
  const { episodeReleaseDate } = useEpisodeReleaseDate(episode.published_at)
  const { isPlaying, isEpisodePlaying } = useIsEpisodePlaying({
    id: episode.id,
  })

  return (
    <Link to={ROUTES.EPISODES.PAGE(episode.id)}>
      <div className="flex flex-col p-4 bg-background border rounded-lg relative">
        <div className="w-full bg-skeleton aspect-square rounded-md overflow-hidden shadow-custom-3">
          <MemoLazyLoadImage
            src={episode.image_url}
            alt={episode.title}
            className="bg-contain aspect-square"
            width="100%"
            height="100%"
          />
        </div>
        <div className="flex gap-1 items-center mt-3">
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
        <h3
          className={clsx(
            'text-sm font-medium truncate mt-1',
            isEpisodePlaying && 'text-primary',
          )}
        >
          {episode.title}
        </h3>
        <p className="line-clamp-2 text-muted-foreground text-xs mt-1">
          {parseHtmlToText(episode.description)}
        </p>
        <div className="flex justify-between mt-4">
          <FeaturedEpisodeCardAction episode={episode} />

          <PodcastActionButton
            episode={episode}
            featured={true}
            latest={true}
          />
        </div>
      </div>
    </Link>
  )
}

type ActionButtonProps = ComponentPropsWithoutRef<typeof Button> & {
  episode: Episode
}

function ActionButton({ children, episode, ...rest }: ActionButtonProps) {
  const { isPlaying, isEpisodePlaying, isNotPlaying } = useIsEpisodePlaying({
    id: episode.id,
  })

  return (
    <Button {...rest} size="sm" className="h-8 px-2">
      {isEpisodePlaying && isPlaying && (
        <PauseIcon
          className="w-3 h-3 mr-2 fill-primary-foreground"
          strokeWidth={1}
        />
      )}
      {isNotPlaying && (
        <PlayIcon className="w-3 h-3 mr-2 fill-primary-foreground" />
      )}
      {children}
    </Button>
  )
}

function FeaturedEpisodeCardAction({ episode }: FeaturedEpisodeCardProps) {
  const { t } = useTranslation()
  const { handlePlayEpisode } = usePlayEpisode({ id: episode.id })
  const {
    episodeDuration,
    hasPlaybackData,
    isEpisodeCompleted,
    listeningProgressPercentage,
    remainingTimeText,
  } = useEpisodeProgress({
    duration: episode.duration,
    playback: episode.playback,
  })

  if (!hasPlaybackData) {
    return (
      <ActionButton onClick={handlePlayEpisode} episode={episode}>
        <span className="text-xs">{episodeDuration}</span>
      </ActionButton>
    )
  }

  if (isEpisodeCompleted) {
    return (
      <div className="flex gap-2 items-center">
        <CircleCheckIcon className="w-5 h-5 fill-foreground stroke-background" />
        <span className="text-xs">{t('podcasts.list.progress.completed')}</span>
      </div>
    )
  }

  return (
    <ActionButton onClick={handlePlayEpisode} episode={episode}>
      <div className="flex gap-2 items-center">
        <div className="min-w-8 w-full h-1 rounded-full relative bg-background/50 overflow-hidden">
          <div
            className="absolute z-10 bg-primary-foreground h-full"
            style={{ width: `${listeningProgressPercentage}%` }}
          />
        </div>
        <span className="text-xs">{remainingTimeText}</span>
      </div>
    </ActionButton>
  )
}
