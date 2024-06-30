import { FormEvent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useMatches, useNavigate } from 'react-router-dom'

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog'
import { Label } from '@/app/components/ui/label'
import { Input } from '@/app/components/ui/input'
import { Button } from '@/app/components/ui/button'
import { usePlaylists } from '@/app/contexts/playlists-context'
import { Switch } from '@/app/components/ui/switch'
import { Playlist } from '@/types/responses/playlist'
import { ROUTES } from '@/routes/routesList'

export function CreatePlaylistDialog() {
  const { t } = useTranslation()
  const {
    data,
    setData,
    playlistDialogState,
    setPlaylistDialogState,
    createPlaylistWithoutSongs,
    editPlaylist,
  } = usePlaylists()
  const matches = useMatches()
  const navigate = useNavigate()

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
      setName(data.name || '')
      setComment(data.comment || '')
      setIsPublic(data.public ?? true)
    }
  }, [data, isCreation])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isCreation) {
      await createPlaylistWithoutSongs(
        name,
        comment,
        isPublic ? 'true' : 'false',
      )
    } else {
      await editPlaylist(data.id, name, comment, isPublic ? 'true' : 'false')
      revalidateDataIfNeeded()
    }

    clear()
    setPlaylistDialogState(false)
  }

  function clear() {
    setData({} as Playlist)
  }

  function revalidateDataIfNeeded() {
    const routePath = ROUTES.PLAYLIST.PAGE(data.id)
    const isOnPlaylistPage = matches[1].pathname === routePath

    if (isOnPlaylistPage) navigate(routePath)
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
