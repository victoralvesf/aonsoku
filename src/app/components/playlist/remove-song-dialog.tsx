import { useMutation, useQueryClient } from '@tanstack/react-query'
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
import { usePlaylistRemoveSong } from '@/store/playlists.store'
import { queryKeys } from '@/utils/queryKeys'

export function RemoveSongFromPlaylistDialog() {
  const { t } = useTranslation()
  const { confirmDialogState, setConfirmDialogState, actionData } =
    usePlaylistRemoveSong()

  const count = actionData.songIndexes.length

  const queryClient = useQueryClient()

  const updateMutation = useMutation({
    mutationFn: subsonic.playlists.update,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.playlist.single, actionData.playlistId],
      })
      toast.success(t('playlist.form.removeSong.toast.success', { count }))
    },
    onError: () => {
      toast.error(t('playlist.form.removeSong.toast.error', { count }))
    },
  })

  async function handleRemoveFromPlaylist() {
    await updateMutation.mutateAsync({
      playlistId: actionData.playlistId,
      songIndexToRemove: actionData.songIndexes,
    })
  }

  return (
    <AlertDialog
      open={confirmDialogState}
      onOpenChange={(state) => setConfirmDialogState(state)}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            {t('playlist.form.removeSong.title', { count })}
          </AlertDialogTitle>
          <AlertDialogDescription>
            {t('playlist.form.removeSong.description')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t('logout.dialog.cancel')}</AlertDialogCancel>
          <AlertDialogAction onClick={handleRemoveFromPlaylist}>
            {t('logout.dialog.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
