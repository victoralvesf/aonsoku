import { useTranslation } from 'react-i18next'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card'
import { GenrePoint } from '@/utils/activity'
import { chartTooltipStyle, GENRE_COLORS } from './chart-tooltip'

interface GenresChartProps {
  genres: GenrePoint[]
}

const MAX_SLICES = 6

export function GenresChart({ genres }: GenresChartProps) {
  const { t } = useTranslation()

  const named = genres.map((genre) => ({
    name: genre.genre || t('activity.genres.unknown'),
    plays: genre.plays,
  }))

  const data =
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

  const total = data.reduce((acc, item) => acc + item.plays, 0)

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium uppercase tracking-wide text-muted-foreground">
          {t('activity.genres.title')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="relative">
          <ResponsiveContainer width="100%" height={220}>
            <PieChart>
              <Pie
                data={data}
                dataKey="plays"
                nameKey="name"
                innerRadius={70}
                outerRadius={95}
                paddingAngle={2}
                strokeWidth={0}
              >
                {data.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={GENRE_COLORS[index % GENRE_COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip contentStyle={chartTooltipStyle} />
            </PieChart>
          </ResponsiveContainer>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold">{total}</span>
            <span className="text-xs text-muted-foreground">
              {t('activity.plays')}
            </span>
          </div>
        </div>

        <ul className="mt-4 space-y-1.5">
          {data.map((entry, index) => (
            <li
              key={entry.name}
              className="flex items-center justify-between text-sm"
            >
              <span className="flex items-center gap-2">
                <span
                  className="h-2.5 w-2.5 rounded-full"
                  style={{
                    background: GENRE_COLORS[index % GENRE_COLORS.length],
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
