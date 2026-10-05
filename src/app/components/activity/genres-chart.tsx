import { useTranslation } from 'react-i18next'
import { Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card'
import { GenrePoint } from '@/utils/activity'
import {
  chartTooltipStyle,
  chartTooltipWrapperStyle,
  getGenreColor,
} from './chart-tooltip'

interface GenresChartProps {
  genres: GenrePoint[]
  total: number
}

const MAX_SLICES = 7

export function GenresChart({ genres, total }: GenresChartProps) {
  const { t } = useTranslation()

  const named = genres.map((genre) => ({
    name: genre.genre || t('activity.genres.unknown'),
    plays: genre.plays,
  }))

  const grouped =
    named.length > MAX_SLICES + 1
      ? [
          ...named.slice(0, MAX_SLICES),
          {
            name: t('activity.genres.others'),
            plays: named
              .slice(MAX_SLICES)
              .reduce((acc, item) => acc + item.plays, 0),
          },
        ]
      : named

  const data = grouped.map((item, index) => ({
    ...item,
    fill: getGenreColor(index),
  }))

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium uppercase tracking-wide text-muted-foreground">
          {t('activity.genres.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col 2xl:flex-row gap-4">
        <div className="relative w-full">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart accessibilityLayer={false}>
              <Pie
                data={data}
                dataKey="plays"
                nameKey="name"
                innerRadius={70}
                outerRadius={95}
                paddingAngle={0}
                strokeWidth={0}
              />
              <Tooltip
                contentStyle={chartTooltipStyle}
                wrapperStyle={chartTooltipWrapperStyle}
              />
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold">{total}</span>
            <span className="text-xs text-muted-foreground">
              {t('activity.plays')}
            </span>
          </div>
        </div>

        <ul className="space-y-1.5 w-full 2xl:w-1/2">
          {data.map((entry) => (
            <li
              key={entry.name}
              className="flex items-center justify-between text-sm"
            >
              <span className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{
                    background: entry.fill,
                  }}
                />
                <span className="truncate">{entry.name}</span>
              </span>
              <span className="text-muted-foreground">
                {total > 0 ? Math.round((entry.plays / total) * 100) : 0}%
              </span>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}
