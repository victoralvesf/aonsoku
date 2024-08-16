import { useMutation, useQueryClient } from '@tanstack/react-query'
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
import { subsonic } from '@/service/subsonic'
import { useRadios } from '@/store/radios.store'
import { Radio } from '@/types/responses/radios'
import { queryKeys } from '@/utils/queryKeys'

export function RemoveRadioDialog() {
  const { t } = useTranslation()
  const { data, setData, confirmDeleteState, setConfirmDeleteState } =
    useRadios()

  const queryClient = useQueryClient()

  const removeMutation = useMutation({
    mutationFn: subsonic.radios.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.radio.all],
      })
      toast.success(t('radios.form.delete.toast.success'))
      setConfirmDeleteState(false)
      setData({} as Radio)
    },
    onError: () => {
      toast.error(t('radios.form.delete.toast.error'))
    },
  })

  async function handleRemoveRadio(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault()

    await removeMutation.mutateAsync(data.id)
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
