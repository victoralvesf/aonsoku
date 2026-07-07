import { useTranslation } from 'react-i18next'
import { cn } from '@/lib/utils'
import { ActivityRange } from '@/types/activity'

const RANGES: ActivityRange[] = ['7d', '30d', '90d', 'all']

interface RangeTabsProps {
  value: ActivityRange
  onChange: (range: ActivityRange) => void
}

export function RangeTabs({ value, onChange }: RangeTabsProps) {
  const { t } = useTranslation()

  return (
    <div className="inline-flex items-center gap-1 rounded-lg bg-muted p-1">
      {RANGES.map((range) => (
        <button
          key={range}
          type="button"
          onClick={() => onChange(range)}
          className={cn(
            'rounded-md px-3 py-1 text-sm font-medium transition-colors',
            value === range
              ? 'bg-primary text-primary-foreground'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {t(`activity.range.${range}`)}
        </button>
      ))}
    </div>
  )
}
