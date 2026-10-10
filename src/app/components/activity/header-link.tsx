import { BarChart3Icon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Button } from '@/app/components/ui/button'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'
import { ROUTES } from '@/routes/routesList'

export function ActivityLink() {
  const { t } = useTranslation()

  return (
    <SimpleTooltip text={t('sidebar.activity')}>
      <Link to={ROUTES.LIBRARY.ACTIVITY}>
        <Button className="h-8 w-8 p-0 rounded-md" variant="ghost">
          <BarChart3Icon className="w-4 h-4" />
        </Button>
      </Link>
    </SimpleTooltip>
  )
}
