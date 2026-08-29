import { useTranslation } from 'react-i18next'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from 'recharts'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/app/components/ui/card'
import { HourPoint } from '@/utils/activity'
import { chartTooltipLabelStyle, chartTooltipStyle } from './chart-tooltip'

interface ListeningHoursChartProps {
  data: HourPoint[]
  peakHour: number | null
}

export function ListeningHoursChart({
  data,
  peakHour,
}: ListeningHoursChartProps) {
  const { t } = useTranslation()

  const peakLabel =
    peakHour !== null ? `${peakHour.toString().padStart(2, '0')}:00` : null

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-base font-medium uppercase tracking-wide text-muted-foreground">
          {t('activity.listeningHours')}
        </CardTitle>
        {peakLabel && (
          <span className="text-sm font-medium text-primary">
            {t('activity.peak')}: {peakLabel}
          </span>
        )}
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart
            data={data}
            margin={{ top: 4, right: 4, bottom: 0, left: 4 }}
          >
            <XAxis
              dataKey="label"
              interval={2}
              tickLine={false}
              axisLine={false}
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
