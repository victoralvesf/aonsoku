import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DailyActivityChart } from '@/app/components/activity/daily-activity-chart'
import { ActivityEmptyState } from '@/app/components/activity/empty-state'
import { GenresChart } from '@/app/components/activity/genres-chart'
import { HistoryHeatmap } from '@/app/components/activity/history-heatmap'
import { ListeningHoursChart } from '@/app/components/activity/listening-hours-chart'
import { RangeTabs } from '@/app/components/activity/range-tabs'
import { RecentPlays } from '@/app/components/activity/recent-plays'
import { SummaryCards } from '@/app/components/activity/summary-cards'
import { TopAlbums } from '@/app/components/activity/top-albums'
import { ShadowHeader } from '@/app/components/album/shadow-header'
import { SongListFallback } from '@/app/components/fallbacks/song-fallbacks'
import { HeaderTitle } from '@/app/components/header-title'
import ListWrapper from '@/app/components/list-wrapper'
import { useActivity } from '@/app/hooks/use-activity'
import { ActivityRange } from '@/types/activity'

export default function Activity() {
  const { t } = useTranslation()
  const [range, setRange] = useState<ActivityRange>('30d')

  const { isLoading, hasData, summary, daily, hours, genres, heatmap, recent } =
    useActivity(range)

  if (isLoading) return <SongListFallback />

  return (
    <div className="w-full">
      <ShadowHeader>
        <div className="flex w-full items-center justify-between gap-4">
          <HeaderTitle
            title={t('sidebar.activity')}
            count={summary.totalPlays}
          />
          {hasData && <RangeTabs value={range} onChange={setRange} />}
        </div>
      </ShadowHeader>

      <ListWrapper>
        {!hasData ? (
          <div className="space-y-8">
            <ActivityEmptyState />
            <TopAlbums />
          </div>
        ) : (
          <div className="space-y-6">
            <SummaryCards summary={summary} />

            <DailyActivityChart data={daily} />

            <div className="grid gap-6 lg:grid-cols-2">
              <ListeningHoursChart
                data={hours.data}
                peakHour={hours.peakHour}
              />
              <GenresChart genres={genres} />
            </div>

            <HistoryHeatmap grid={heatmap.grid} max={heatmap.max} />

            <TopAlbums />

            {recent.length > 0 && <RecentPlays events={recent} />}
          </div>
        )}
      </ListWrapper>
    </div>
  )
}
