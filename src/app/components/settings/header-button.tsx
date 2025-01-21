import { Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/app/components/ui/button'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'
import { useAppSettings } from '@/store/app.store'

export function SettingsButton() {
  const { t } = useTranslation()
  const { setOpenDialog } = useAppSettings()

  return (
    <SimpleTooltip text={t('settings.label')} side="bottom">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setOpenDialog(true)}
        className="h-8 w-8 p-0 rounded-md"
      >
        <Settings className="w-4 h-4" />
      </Button>
    </SimpleTooltip>
  )
}
