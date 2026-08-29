import { ActivityRange, PlayEvent } from '@/types/activity'
import dateTime from './dateTime'

const RANGE_DAYS: Record<Exclude<ActivityRange, 'all'>, number> = {
  '7d': 7,
  '30d': 30,
  '90d': 90,
}

function dayKey(ms: number): string {
  return dateTime(ms).format('YYYY-MM-DD')
}

export function filterEventsByRange(
  events: PlayEvent[],
  range: ActivityRange,
): PlayEvent[] {
  if (range === 'all') return events

  const cutoff = dateTime()
    .startOf('day')
    .subtract(RANGE_DAYS[range] - 1, 'day')
    .valueOf()

  return events.filter((event) => event.playedAt >= cutoff)
}

export interface ActivitySummary {
  totalPlays: number
  listeningTimeSec: number
  uniqueArtists: number
  currentStreak: number
  bestStreak: number
}

function computeStreaks(daySet: Set<string>) {
  if (daySet.size === 0) return { currentStreak: 0, bestStreak: 0 }

  const days = Array.from(daySet).sort()

  let bestStreak = 1
  let run = 1
  for (let i = 1; i < days.length; i++) {
    const diff = dateTime(days[i]).diff(dateTime(days[i - 1]), 'day')
    run = diff === 1 ? run + 1 : 1
    if (run > bestStreak) bestStreak = run
  }

  const todayKey = dateTime().startOf('day').format('YYYY-MM-DD')
  const yesterdayKey = dateTime()
    .startOf('day')
    .subtract(1, 'day')
    .format('YYYY-MM-DD')

  let currentStreak = 0
  if (daySet.has(todayKey) || daySet.has(yesterdayKey)) {
    let cursor = dateTime().startOf('day')
    if (!daySet.has(todayKey)) cursor = cursor.subtract(1, 'day')

    while (daySet.has(cursor.format('YYYY-MM-DD'))) {
      currentStreak += 1
      cursor = cursor.subtract(1, 'day')
    }
  }

  return { currentStreak, bestStreak }
}

export function getActivitySummary(events: PlayEvent[]): ActivitySummary {
  const listeningTimeSec = events.reduce(
    (acc, event) => acc + (event.duration || 0),
    0,
  )
  const artists = new Set(
    events.map((event) => event.artistId || event.artist).filter(Boolean),
  )
  const days = new Set(events.map((event) => dayKey(event.playedAt)))
  const { currentStreak, bestStreak } = computeStreaks(days)

  return {
    totalPlays: events.length,
    listeningTimeSec,
    uniqueArtists: artists.size,
    currentStreak,
    bestStreak,
  }
}

export interface DailyActivityPoint {
  date: string
  label: string
  plays: number
}

function spanDays(events: PlayEvent[]): number {
  if (events.length === 0) return 7

  const firstPlayedAt = events.reduce(
    (min, event) => (event.playedAt < min ? event.playedAt : min),
    events[0].playedAt,
  )
  const diff =
    dateTime()
      .startOf('day')
      .diff(dateTime(firstPlayedAt).startOf('day'), 'day') + 1

  return Math.min(Math.max(diff, 7), 365)
}

export function getDailyActivity(
  events: PlayEvent[],
  range: ActivityRange,
): DailyActivityPoint[] {
  const days = range === 'all' ? spanDays(events) : RANGE_DAYS[range]

  const counts = new Map<string, number>()
  events.forEach((event) => {
    const key = dayKey(event.playedAt)
    counts.set(key, (counts.get(key) ?? 0) + 1)
  })

  const start = dateTime()
    .startOf('day')
    .subtract(days - 1, 'day')

  const points: DailyActivityPoint[] = []
  for (let i = 0; i < days; i++) {
    const day = start.add(i, 'day')
    const key = day.format('YYYY-MM-DD')
    points.push({
      date: key,
      label: day.format('DD/MM'),
      plays: counts.get(key) ?? 0,
    })
  }

  return points
}

export interface HourPoint {
  hour: number
  label: string
  plays: number
}

export function getListeningHours(events: PlayEvent[]) {
  const counts = new Array<number>(24).fill(0)
  events.forEach((event) => {
    counts[dateTime(event.playedAt).hour()] += 1
  })

  const data: HourPoint[] = counts.map((plays, hour) => ({
    hour,
    label: `${hour.toString().padStart(2, '0')}:00`,
    plays,
  }))

  let peakHour: number | null = null
  let max = 0
  counts.forEach((count, hour) => {
    if (count > max) {
      max = count
      peakHour = hour
    }
  })

  return { data, peakHour }
}

export interface GenrePoint {
  genre: string
  plays: number
}

export function getGenreBreakdown(events: PlayEvent[]): GenrePoint[] {
  const counts = new Map<string, number>()
  events.forEach((event) => {
    const genre = event.genre?.trim() || ''
    counts.set(genre, (counts.get(genre) ?? 0) + 1)
  })

  return Array.from(counts.entries())
    .map(([genre, plays]) => ({ genre, plays }))
    .sort((a, b) => b.plays - a.plays)
}

export interface HeatmapDay {
  date: string
  count: number
}

export function getHeatmap(events: PlayEvent[], weeks = 26) {
  const counts = new Map<string, number>()
  events.forEach((event) => {
    const key = dayKey(event.playedAt)
    counts.set(key, (counts.get(key) ?? 0) + 1)
  })

  const today = dateTime().startOf('day')
  const mondayIndex = (today.day() + 6) % 7
  const lastDay = today.add(6 - mondayIndex, 'day')
  const totalDays = weeks * 7
  const startDay = lastDay.subtract(totalDays - 1, 'day')

  const grid: HeatmapDay[][] = []
  let max = 0
  for (let week = 0; week < weeks; week++) {
    const column: HeatmapDay[] = []
    for (let weekday = 0; weekday < 7; weekday++) {
      const day = startDay.add(week * 7 + weekday, 'day')
      const key = day.format('YYYY-MM-DD')
      const count = counts.get(key) ?? 0
      if (count > max) max = count
      column.push({ date: key, count })
    }
    grid.push(column)
  }

  return { grid, max }
}

export function getRecentPlays(events: PlayEvent[], limit = 30): PlayEvent[] {
  return [...events].sort((a, b) => b.playedAt - a.playedAt).slice(0, limit)
}
