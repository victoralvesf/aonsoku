import { AudioLines } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card'
import { PlayEvent } from '@/types/activity'
import dateTime from '@/utils/dateTime'

interface RecentPlaysProps {
  events: PlayEvent[]
}

export function RecentPlays({ events }: RecentPlaysProps) {
  const { t } = useTranslation()

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium uppercase tracking-wide text-muted-foreground">
          {t('activity.recentPlays')}
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <ul className="divide-y divide-border">
          {events.map((event, index) => (
            <li
              key={`${event.songId}-${event.playedAt}-${index}`}
              className="flex items-center gap-3 px-6 py-2.5"
            >
              <AudioLines className="h-4 w-4 shrink-0 text-muted-foreground" />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium">{event.title}</p>
                <p className="truncate text-xs text-muted-foreground">
                  {event.album
                    ? `${event.artist} — ${event.album}`
                    : event.artist}
                </p>
              </div>
              <span className="shrink-0 text-xs text-muted-foreground">
                {dateTime(event.playedAt).fromNow()}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
