import { MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
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
import { useRadios } from '@/store/radios.store'
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

    try {
      await deleteRadio(data.id)
      setConfirmDeleteState(false)
      setData({} as Radio)

      toast.success(t('radios.form.delete.toast.success'))
    } catch (_) {
      toast.error(t('radios.form.delete.toast.success'))
    }
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
