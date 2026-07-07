import { Clock, Flame, Music2, Users } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ActivitySummary } from '@/utils/activity'
import { convertSecondsToHumanRead } from '@/utils/convertSecondsToTime'
import { StatCard } from './stat-card'

interface SummaryCardsProps {
  summary: ActivitySummary
}

export function SummaryCards({ summary }: SummaryCardsProps) {
  const { t } = useTranslation()

  const listeningTime =
    summary.listeningTimeSec > 0
      ? convertSecondsToHumanRead(summary.listeningTimeSec)
      : '0'

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
      <StatCard
        icon={Music2}
        value={summary.totalPlays.toString()}
        label={t('activity.summary.totalPlays')}
      />
      <StatCard
        icon={Clock}
        value={listeningTime}
        label={t('activity.summary.listeningTime')}
      />
      <StatCard
        icon={Users}
        value={summary.uniqueArtists.toString()}
        label={t('activity.summary.uniqueArtists')}
      />
      <StatCard
        icon={Flame}
        value={t('activity.summary.streakValue', {
          count: summary.currentStreak,
        })}
        label={t('activity.summary.streak')}
        hint={t('activity.summary.streakBest', { count: summary.bestStreak })}
      />
    </div>
  )
}
