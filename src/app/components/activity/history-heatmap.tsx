import { CSSProperties } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card'
import { HeatmapDay } from '@/utils/activity'
import dateTime from '@/utils/dateTime'

interface HistoryHeatmapProps {
  grid: HeatmapDay[][]
  max: number
}

const LEVEL_OPACITY = [0, 0.25, 0.45, 0.7, 1]

function levelFor(count: number, max: number): number {
  if (count === 0 || max === 0) return 0
  const ratio = count / max
  if (ratio > 0.75) return 4
  if (ratio > 0.5) return 3
  if (ratio > 0.25) return 2
  return 1
}

function cellStyle(count: number, max: number): CSSProperties {
  const level = levelFor(count, max)
  if (level === 0) return { background: 'hsl(var(--muted))' }

  return { background: 'hsl(var(--primary))', opacity: LEVEL_OPACITY[level] }
}

// 2024-01-01 was a Monday, so it anchors localized weekday labels (Mon first).
const MONDAY = dateTime('2024-01-01')

export function HistoryHeatmap({ grid, max }: HistoryHeatmapProps) {
  const { t } = useTranslation()

  const weekdayLabels = Array.from({ length: 7 }, (_, index) =>
    index === 0 || index === 2 || index === 4
      ? MONDAY.add(index, 'day').format('dd')
      : '',
  )

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium uppercase tracking-wide text-muted-foreground">
          {t('activity.history')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <div className="min-w-min">
            <div className="mb-1 flex gap-1 text-[10px] text-muted-foreground">
              <div className="w-6 shrink-0" />
              {grid.map((column, index) => {
                const month = dateTime(column[0].date).format('MMM')
                const prevMonth =
                  index > 0
                    ? dateTime(grid[index - 1][0].date).format('MMM')
                    : ''
                const label = month !== prevMonth ? month : ''

                return (
                  <div
                    key={column[0].date}
                    className="w-3 shrink-0 whitespace-nowrap"
                  >
                    {label}
                  </div>
                )
              })}
            </div>

            <div className="flex gap-1">
              <div className="flex w-6 shrink-0 flex-col gap-1 text-[10px] text-muted-foreground">
                {weekdayLabels.map((label, index) => (
                  <div key={index} className="h-3 leading-3">
                    {label}
                  </div>
                ))}
              </div>

              {grid.map((column) => (
                <div key={column[0].date} className="flex flex-col gap-1">
                  {column.map((day) => (
                    <div
                      key={day.date}
                      className="h-3 w-3 rounded-sm"
                      style={cellStyle(day.count, max)}
                      title={`${day.date} · ${day.count}`}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-end gap-1.5 text-xs text-muted-foreground">
          <span>{t('activity.less')}</span>
          {LEVEL_OPACITY.map((_, level) => (
            <span
              key={level}
              className="h-3 w-3 rounded-sm"
              style={cellStyle(
                level === 0 ? 0 : level,
                LEVEL_OPACITY.length - 1,
              )}
            />
          ))}
          <span>{t('activity.more')}</span>
        </div>
      </CardContent>
    </Card>
  )
}
