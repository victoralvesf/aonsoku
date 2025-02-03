import clsx from 'clsx'
import { convert } from 'html-to-text'
import { EllipsisVertical, PlayIcon } from 'lucide-react'
import { ComponentPropsWithoutRef, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Link } from 'react-router-dom'
import { Button } from '@/app/components/ui/button'
import { Separator } from '@/app/components/ui/separator'
import { Episode } from '@/types/responses/podcasts'
import { convertSecondsToHumanRead } from '@/utils/convertSecondsToTime'
import dateTime from '@/utils/dateTime'

type EpisodeCardProps = ComponentPropsWithoutRef<'div'> & {
  episode: Episode
}

export function EpisodeCard({ episode, ...rest }: EpisodeCardProps) {
  const { t } = useTranslation()

  const formatEpisodeDate = useCallback(
    (date: string) => {
      const today = dateTime()
      const targetDate = dateTime(date)
      const diffInDays = today.diff(targetDate, 'days')

      if (today.year() !== targetDate.year()) {
        return targetDate.format('L')
      }

      if (diffInDays > 15) {
        return targetDate.format('DD MMM')
      }

      const parsed = dateTime().from(targetDate, true)
      return t('table.lastPlayed', { date: parsed })
    },
    [t],
  )

  const formatEpisodeDescription = useCallback((text: string) => {
    return convert(text, {
      wordwrap: false,
      selectors: [{ selector: 'a', format: 'inline' }],
    })
  }, [])

  const formatEpisodeDuration = useCallback((duration: number) => {
    return convertSecondsToHumanRead(duration)
  }, [])

  return (
    <div className="group/row" {...rest}>
      <Link
        to={`/episodes/${episode.id}`}
        className="flex gap-2 items-center px-4 py-3 rounded-lg max-w-full group-hover/row:bg-foreground/20"
      >
        <div
          className={clsx(
            'w-[100px] h-[100px] min-w-[100px] min-h-[100px]',
            'bg-skeleton aspect-square bg-cover bg-center',
            'rounded-md overflow-hidden border border-border',
            'shadow-[0_0_3px_rgba(255,255,255,0.03)] relative',
          )}
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
            >
              <PlayIcon className="w-4 h-4 fill-foreground" />
            </Button>
          </div>
        </div>
        <div className="flex flex-col flex-1 space-y-1 min-w-64">
          <span className="text-xs text-muted-foreground font-medium uppercase w-fit">
            {formatEpisodeDate(episode.published_at)}
          </span>
          <h4 className="text-sm font-medium w-fit max-w-full truncate">
            {episode.title}
          </h4>
          <p className="text-xs text-muted-foreground line-clamp-2">
            {formatEpisodeDescription(episode.description)}
          </p>
        </div>
        <div className="min-w-[14%] flex items-center justify-center">
          <span className="text-xs text-muted-foreground">
            {formatEpisodeDuration(episode.duration)}
          </span>
        </div>
        <div className="min-w-16 flex items-center justify-end">
          <Button
            variant="ghost"
            size="icon"
            className="hover:bg-background rounded-full"
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
