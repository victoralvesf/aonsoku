import { MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/app/components/ui/alert-dialog'
import { useRadios } from '@/app/contexts/radios-context'
import { Radio } from '@/types/responses/radios'

export function RemoveRadioDialog() {
  const { t } = useTranslation()
  const {
    data,
    setData,
    confirmDeleteState,
    setConfirmDeleteState,
    deleteRadio,
  } = useRadios()

  async function handleRemoveRadio(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault()
    await deleteRadio(data.id)
    setConfirmDeleteState(false)
    setData({} as Radio)
  }

  return (
    <AlertDialog open={confirmDeleteState}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('radios.form.delete.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('radios.form.delete.description')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setConfirmDeleteState(false)}>
            {t('logout.dialog.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleRemoveRadio}>
            {t('logout.dialog.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
