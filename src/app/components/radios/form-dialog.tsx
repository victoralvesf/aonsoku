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
import { useRadios } from '@/store/radios.store'
import { Radio } from '@/types/responses/radios'

export function RadioFormDialog() {
  const { t } = useTranslation()
  const {
    data,
    setData,
    dialogState,
    setDialogState,
    createRadio,
    updateRadio,
  } = useRadios()

  const [name, setName] = useState('')
  const [homePageUrl, setHomePageUrl] = useState('')
  const [streamUrl, setStreamUrl] = useState('')

  const isCreation = Object.keys(data).length === 0

  useEffect(() => {
    if (isCreation) {
      setName('')
      setHomePageUrl('')
      setStreamUrl('')
    } else {
      setName(data.name ?? '')
      setHomePageUrl(data.homePageUrl ?? '')
      setStreamUrl(data.streamUrl ?? '')
    }
  }, [data, isCreation])

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (isCreation) {
      try {
        await createRadio({
          name,
          homePageUrl,
          streamUrl,
        })

        toast.success(t('radios.form.create.toast.success'))
      } catch (_) {
        toast.error(t('radios.form.create.toast.success'))
      }
    } else {
      try {
        await updateRadio({
          id: data.id,
          name,
          homePageUrl,
          streamUrl,
        })

        toast.success(t('radios.form.edit.toast.success'))
      } catch (_) {
        toast.error(t('radios.form.edit.toast.success'))
      }
    }

    clear()
    setDialogState(false)
  }

  function clear() {
    setData({} as Radio)
  }

  return (
    <Dialog
      defaultOpen={false}
      open={dialogState}
      onOpenChange={(state) => {
        if (!state) clear()
        setDialogState(state)
      }}
    >
      <DialogContent className="max-w-[500px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>
              {t(`radios.form.${isCreation ? 'create' : 'edit'}.title`)}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 py-4">
            <div className="flex flex-col gap-2 items-start">
              <Label htmlFor="name" className="text-right font-normal">
                {t('radios.table.name')} *
              </Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="flex flex-col gap-2 items-start">
              <Label htmlFor="home-page-url" className="text-right font-normal">
                {t('radios.table.homepage')}
              </Label>
              <Input
                id="home-page-url"
                type="url"
                pattern="https?://.*"
                value={homePageUrl}
                autoCorrect="false"
                autoCapitalize="false"
                spellCheck="false"
                onChange={(e) => setHomePageUrl(e.target.value)}
              />
            </div>
            <div className="flex flex-col gap-2 items-start">
              <Label htmlFor="stream-url" className="text-right font-normal">
                {t('radios.table.stream')} *
              </Label>
              <Input
                id="stream-url"
                type="url"
                pattern="https?://.*"
                value={streamUrl}
                required
                autoCorrect="false"
                autoCapitalize="false"
                spellCheck="false"
                onChange={(e) => setStreamUrl(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit">
              {t(`radios.form.${isCreation ? 'create' : 'edit'}.button`)}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
