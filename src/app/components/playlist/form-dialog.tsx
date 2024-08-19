import { useMutation, useQueryClient } from '@tanstack/react-query'
import { FormEvent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { toast } from 'react-toastify'
import { Button } from '@/app/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog'
import { Input } from '@/app/components/ui/input'
import { Label } from '@/app/components/ui/label'
import { Switch } from '@/app/components/ui/switch'
import { subsonic } from '@/service/subsonic'
import { usePlaylists } from '@/store/playlists.store'
import { PlaylistData } from '@/types/playlistsContext'
import { queryKeys } from '@/utils/queryKeys'

export function CreatePlaylistDialog() {
  const { t } = useTranslation()
  const { data, setData, playlistDialogState, setPlaylistDialogState } =
    usePlaylists()

  const [name, setName] = useState('')
  const [comment, setComment] = useState('')
  const [isPublic, setIsPublic] = useState<boolean>(true)

  const isCreation = Object.keys(data).length === 0

  useEffect(() => {
    if (isCreation) {
      setName('')
      setComment('')
      setIsPublic(true)
    } else {
      setName(data.name ?? '')
      setComment(data.comment ?? '')
      setIsPublic(data.public)
    }
  }, [data, isCreation])

  const queryClient = useQueryClient()

  const createMutation = useMutation({
    mutationFn: subsonic.playlists.createWithDetails,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: [queryKeys.playlist.all],
      })
      toast.success(t('playlist.form.create.toast.success'))
    },
    onError: () => {
      toast.error(t('playlist.form.create.toast.success'))
    },
  })

  const updateMutation = useMutation({
    mutationFn: subsonic.playlists.update,
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: [queryKeys.playlist.all],
        }),
        queryClient.invalidateQueries({
          queryKey: [queryKeys.playlist.single, data.id],
        }),
      ])
      toast.success(t('playlist.form.edit.toast.success'))
    },
    onError: () => {
      toast.error(t('playlist.form.edit.toast.error'))
    },
  })

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isCreation) {
      await createMutation.mutateAsync({
        name,
        comment,
        isPublic: isPublic ? 'true' : 'false',
      })
    } else {
      await updateMutation.mutateAsync({
        playlistId: data.id,
        name,
        comment,
        isPublic: isPublic ? 'true' : 'false',
      })
    }

    setPlaylistDialogState(false)
    clear()
  }

  function clear() {
    setData({} as PlaylistData)
  }

  return (
    <Dialog
      defaultOpen={false}
      open={playlistDialogState}
      onOpenChange={(state) => {
        if (!state) clear()
        setPlaylistDialogState(state)
      }}
    >
      <DialogContent className="max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {t(`playlist.form.${isCreation ? 'create' : 'edit'}.title`)}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2 items-start">
              <Label htmlFor="name" className="text-right font-normal">
                {t('playlist.form.labels.name')}
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2 items-start">
              <Label htmlFor="comment" className="text-right font-normal">
                {t('playlist.form.labels.comment')}
              </Label>
              <Input
                id="comment"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <div className="flex gap-2 items-center">
              <Switch
                id="is-public"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
              <Label htmlFor="is-public" className="font-normal">
                {t('playlist.form.labels.isPublic')}
              </Label>
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              {t(`playlist.form.${isCreation ? 'create' : 'edit'}.button`)}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
