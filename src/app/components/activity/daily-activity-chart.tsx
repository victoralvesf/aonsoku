import { useTranslation } from 'react-i18next'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card'
import { DailyActivityPoint } from '@/utils/activity'
import { chartTooltipLabelStyle, chartTooltipStyle } from './chart-tooltip'

interface DailyActivityChartProps {
  data: DailyActivityPoint[]
}

export function DailyActivityChart({ data }: DailyActivityChartProps) {
  const { t } = useTranslation()

  const interval = Math.max(0, Math.floor(data.length / 8))

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium uppercase tracking-wide text-muted-foreground">
          {t('activity.dailyActivity')}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={data}
            margin={{ top: 4, right: 4, bottom: 0, left: 4 }}
          >
            <XAxis
              dataKey="label"
              interval={interval}
              tickLine={false}
              axisLine={false}
              minTickGap={12}
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
            />
            <Tooltip
              cursor={{ fill: 'hsl(var(--muted))', opacity: 0.4 }}
              contentStyle={chartTooltipStyle}
              labelStyle={chartTooltipLabelStyle}
            />
            <Bar
              dataKey="plays"
              name={t('activity.plays')}
              fill="hsl(var(--primary))"
              radius={[3, 3, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
