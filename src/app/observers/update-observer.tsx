import { useQuery } from '@tanstack/react-query'
import { Loader2, RocketIcon } from 'lucide-react'
import { FormEvent, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import Markdown from 'react-markdown'
import { toast } from 'react-toastify'
import rehypeRaw from 'rehype-raw'
import remarkGfm from 'remark-gfm'
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/app/components/ui/alert-dialog'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import { useAppUpdate } from '@/store/app.store'
import { getAppInfo } from '@/utils/appName'
import { isMacOS } from '@/utils/desktop'
import { sanitizeLinks } from '@/utils/parseTexts'
import { queryKeys } from '@/utils/queryKeys'

export function UpdateObserver() {
  const { t } = useTranslation()
  const { openDialog, setOpenDialog, remindOnNextBoot, setRemindOnNextBoot } =
    useAppUpdate()
  const [updateHasStarted, setUpdateHasStarted] = useState(false)

  const { data: updateCheckResult } = useQuery({
    queryKey: [queryKeys.update.check],
    queryFn: async () => await window.api.checkForUpdates(),
    enabled: !remindOnNextBoot,
    refetchOnWindowFocus: false,
    refetchOnMount: false,
    staleTime: Infinity,
    gcTime: Infinity,
  })

  useEffect(() => {
    if (updateCheckResult?.isUpdateAvailable) {
      setOpenDialog(true)
    }
  }, [setOpenDialog, updateCheckResult])

  useEffect(() => {
    window.api.onUpdateDownloaded(() => {
      toast.update('update', {
        render: t('update.toasts.success'),
        type: 'success',
        autoClose: 5000,
        isLoading: false,
      })
      window.api.quitAndInstall()
    })

    window.api.onUpdateError(() => {
      setUpdateHasStarted(false)
      setRemindOnNextBoot(true)

      toast.update('update', {
        render: t('update.toasts.error'),
        type: 'error',
        autoClose: 5000,
        isLoading: false,
      })
    })
  }, [t, setRemindOnNextBoot])

  if (!updateCheckResult || !updateCheckResult.isUpdateAvailable) return null

  const handleUpdate = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    toast(t('update.toasts.started'), {
      autoClose: false,
      type: 'default',
      isLoading: true,
      toastId: 'update',
    })

    setUpdateHasStarted(true)
    window.api.downloadUpdate()
  }

  const { updateInfo } = updateCheckResult

  function getReleaseNotes() {
    if (typeof updateInfo.releaseNotes === 'string') {
      return updateInfo.releaseNotes
    } else if (Array.isArray(updateInfo.releaseNotes)) {
      return updateInfo.releaseNotes.map((note) => note.note).join('\n')
    }

    return updateInfo.version
  }

  return (
    <AlertDialog open={openDialog}>
      <AlertDialogContent>
        <AlertDialogDescription className="sr-only">
          {t('update.dialog.title')}
        </AlertDialogDescription>
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
          <div className="space-y-2 text-sm">
            <Markdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw]}>
              {sanitizeLinks(getReleaseNotes())}
            </Markdown>
          </div>
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
            {!isMacOS ? (
              <Button
                variant="default"
                disabled={updateHasStarted}
                type="submit"
              >
                {updateHasStarted ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  t('update.dialog.install')
                )}
              </Button>
            ) : (
              <Button variant="default" asChild>
                <a
                  href={getAppInfo().releaseUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  {t('update.dialog.macOS')}
                </a>
              </Button>
            )}
          </form>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
