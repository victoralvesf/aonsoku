import { FormEvent, useState } from "react"
import { useTranslation } from "react-i18next"

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/app/components/ui/dialog"
import { Label } from "@/app/components/ui/label"
import { Input } from "@/app/components/ui/input"
import { Button } from "@/app/components/ui/button"
import { usePlaylists } from "@/app/contexts/playlists-context"

export function CreatePlaylistDialog() {
  const [name, setName] = useState('')
  const { t } = useTranslation()
  const {
    playlistDialogState,
    setPlaylistDialogState,
    createPlaylistWithoutSongs
  } = usePlaylists()

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    await createPlaylistWithoutSongs(name)
    setPlaylistDialogState(false)
    setName('')
  }

  return (
    <Dialog
      defaultOpen={false}
      open={playlistDialogState}
      onOpenChange={setPlaylistDialogState}
    >
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {t('playlist.createDialog.title')}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2 items-start">
              <Label htmlFor="name" className="text-right font-normal">
                {t('playlist.createDialog.nameLabel')}
              </Label>
              <Input
                id="name"
                placeholder={t('playlist.createDialog.namePlaceholder')}
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              {t('playlist.createDialog.saveButton')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}