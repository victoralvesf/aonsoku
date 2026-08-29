import { BarChart3 } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function ActivityEmptyState() {
  const { t } = useTranslation()

  return (
    <div className="flex flex-col items-center justify-center gap-3 py-24 text-center">
      <BarChart3 className="h-12 w-12 text-muted-foreground/50" />
      <h3 className="text-lg font-semibold">{t('activity.empty.title')}</h3>
      <p className="max-w-sm text-sm text-muted-foreground">
        {t('activity.empty.description')}
      </p>
    </div>
  )
}
