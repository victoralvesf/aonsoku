import { useTranslation } from 'react-i18next'
import { Button } from '@/app/components/ui/button'
import { useRadios } from '@/store/radios.store'
import { Radio } from '@/types/responses/radios'

export function EmptyRadiosInfo() {
  const { t } = useTranslation()
  const { setDialogState, setData } = useRadios()

  function handleAddRadio() {
    setData({} as Radio)
    setDialogState(true)
  }

  return (
    <div className="text-center max-w-[500px]">
      <h3 className="text-2xl font-semibold tracking-tight">
        {t('radios.empty.title')}
      </h3>
      <p className="text-sm text-muted-foreground">{t('radios.empty.info')}</p>

      <Button
        size="sm"
        variant="default"
        className="mt-4"
        onClick={handleAddRadio}
      >
        <span>{t('radios.addRadio')}</span>
      </Button>
    </div>
  )
}
