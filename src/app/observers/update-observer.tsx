import { useQuery } from '@tanstack/react-query'
import { relaunch } from '@tauri-apps/plugin-process'
import { check } from '@tauri-apps/plugin-updater'
import { Loader2, RocketIcon } from 'lucide-react'
import { FormEvent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Markdown from 'react-markdown'
import { toast } from 'react-toastify'
import remarkGfm from 'remark-gfm'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/app/components/ui/alert-dialog'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { useAppUpdate } from '@/store/app.store'
import { isProd } from '@/utils/env'
import { queryKeys } from '@/utils/queryKeys'

export function UpdateObserver() {
  const { t } = useTranslation()
  const { openDialog, setOpenDialog, remindOnNextBoot, setRemindOnNextBoot } =
    useAppUpdate()
  const [updateHasStarted, setUpdateHasStarted] = useState(false)

  const { data: updateInfo } = useQuery({
    queryKey: [queryKeys.update.check],
    queryFn: () => check(),
    enabled: !remindOnNextBoot && isProd,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
    gcTime: Infinity,
  })

  useEffect(() => {
    if (updateInfo) {
      setOpenDialog(true)
    }
  }, [setOpenDialog, updateInfo])

  if (!updateInfo || !updateInfo.available) return null

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    toast(t('update.toasts.started'), {
      autoClose: false,
      type: 'default',
      isLoading: true,
      toastId: 'update',
    })

    try {
      setUpdateHasStarted(true)
      await updateInfo.downloadAndInstall()

      toast.update('update', {
        render: t('update.toasts.success'),
        type: 'success',
        autoClose: 5000,
        isLoading: false,
      })

      await relaunch()
    } catch (_) {
      setUpdateHasStarted(false)
      setRemindOnNextBoot(true)

      toast.update('update', {
        render: t('update.toasts.error'),
        type: 'error',
        autoClose: 5000,
        isLoading: false,
      })
    }
  }

  return (
    <AlertDialog open={openDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle className="flex items-center gap-2">
            <RocketIcon className="w-6 h-6 text-primary fill-primary/60" />
            <span>{t('update.dialog.title')}</span>
            <Badge>{updateInfo.version}</Badge>
          </AlertDialogTitle>
        </AlertDialogHeader>

        <div
          id="update-info-body"
          className="w-full min-h-16 max-h-80 overflow-auto text-muted-foreground bg-background-foreground p-4 border rounded-md"
        >
          <Markdown className="space-y-2 text-sm" remarkPlugins={[remarkGfm]}>
            {updateInfo.body}
          </Markdown>
        </div>

        <AlertDialogFooter>
          <form onSubmit={handleUpdate} className="flex gap-2">
            <Button
              variant="outline"
              disabled={updateHasStarted}
              onClick={() => {
                setOpenDialog(false)
                setRemindOnNextBoot(true)
              }}
              type="button"
            >
              {t('update.dialog.remindLater')}
            </Button>
            <Button variant="default" disabled={updateHasStarted} type="submit">
              {updateHasStarted ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                t('update.dialog.install')
              )}
            </Button>
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
