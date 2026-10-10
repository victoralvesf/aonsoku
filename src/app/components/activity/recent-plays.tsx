import { useTranslation } from 'react-i18next'
import { CoverImage } from '@/app/components/table/cover-image'
import { PlayEvent } from '@/types/activity'
import dateTime from '@/utils/dateTime'

interface RecentPlaysProps {
  events: PlayEvent[]
}

export function RecentPlays({ events }: RecentPlaysProps) {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col gap-2 !mt-10">
      <span className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
        {t('activity.recentPlays')}
      </span>
      <ul className="divide-y divide-border border-y border-border">
        {events.map((event, index) => (
          <li
            key={`${event.songId}-${event.playedAt}-${index}`}
            className="flex items-center gap-3 px-0 py-2.5"
          >
            <CoverImage
              coverArt={event.songId}
              coverArtType="song"
              altText={event.title}
            />
            <div className="min-w-0 flex-1 pr-4">
              <p className="truncate text-sm font-medium">{event.title}</p>
              <p className="truncate text-xs text-muted-foreground">
                {event.artist}
              </p>
            </div>
            <span className="shrink-0 text-xs text-muted-foreground">
              {dateTime(event.playedAt).fromNow()}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}
