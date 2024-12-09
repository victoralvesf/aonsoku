import { useMutation, useQueryClient } from '@tanstack/react-query'
import { MouseEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { useMatches, useNavigate } from 'react-router-dom'
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
import { ROUTES } from '@/routes/routesList'
import { subsonic } from '@/service/subsonic'
import { useRemovePlaylist } from '@/store/playlists.store'
import { queryKeys } from '@/utils/queryKeys'

export function RemovePlaylistDialog() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const matches = useMatches()

  const { playlistId, confirmDialogState, setConfirmDialogState } =
    useRemovePlaylist()

  function navigateIfNeeded() {
    const isOnPlaylistPage = matches.find((route) => route.id === 'playlist')
    const pageId = isOnPlaylistPage?.params.playlistId ?? ''

    if (pageId === playlistId) navigate(ROUTES.LIBRARY.HOME)
  }

  const queryClient = useQueryClient()

  const removeMutation = useMutation({
    mutationFn: subsonic.playlists.remove,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.playlist.all],
      })
      toast.success(t('playlist.form.delete.toast.success'))
      setConfirmDialogState(false)
      navigateIfNeeded()
    },
    onError: () => {
      toast.error(t('playlist.form.delete.toast.error'))
    },
  })

  async function handleRemovePlaylist(e: MouseEvent<HTMLButtonElement>) {
    e.preventDefault()

    await removeMutation.mutateAsync(playlistId)
  }

  return (
    <AlertDialog open={confirmDialogState}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t('playlist.form.delete.title')}</AlertDialogTitle>
          <AlertDialogDescription>
            {t('playlist.form.delete.description')}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setConfirmDialogState(false)}>
            {t('logout.dialog.cancel')}
          </AlertDialogCancel>
          <AlertDialogAction onClick={handleRemovePlaylist}>
            {t('logout.dialog.confirm')}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
