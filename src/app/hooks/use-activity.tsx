import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { getPlayEvents } from '@/store/activity-store'
import { ActivityRange } from '@/types/activity'
import {
  filterEventsByRange,
  getActivitySummary,
  getDailyActivity,
  getGenreBreakdown,
  getHeatmap,
  getListeningHours,
  getRecentPlays,
} from '@/utils/activity'
import { queryKeys } from '@/utils/queryKeys'

export function useActivityEvents() {
  return useQuery({
    queryKey: [queryKeys.activity.events],
    queryFn: getPlayEvents,
  })
}

export function useActivity(range: ActivityRange) {
  const { data: events = [], isLoading } = useActivityEvents()

  const stats = useMemo(() => {
    const scoped = filterEventsByRange(events, range)

    return {
      hasData: events.length > 0,
      summary: getActivitySummary(scoped),
      daily: getDailyActivity(scoped, range),
      hours: getListeningHours(scoped),
      genres: getGenreBreakdown(scoped),
      heatmap: getHeatmap(events),
      recent: getRecentPlays(scoped),
    }
  }, [events, range])

  return { ...stats, isLoading }
}
