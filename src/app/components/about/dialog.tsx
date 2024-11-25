import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { toast } from 'react-toastify'
import { Dialog, DialogContent, DialogHeader } from '@/app/components/ui/dialog'
import { subsonic } from '@/service/subsonic'
import { getAppInfo } from '@/utils/appName'
import { isLinux } from '@/utils/osType'
import { queryKeys } from '@/utils/queryKeys'

interface AboutDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AboutDialog({ open, onOpenChange }: AboutDialogProps) {
  const { t } = useTranslation()
  const { name, version, url } = getAppInfo()

  const { data: server, isLoading } = useQuery({
    queryKey: [queryKeys.update.serverInfo],
    queryFn: subsonic.ping.pingInfo,
  })

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="p-0 overflow-hidden gap-0 cursor-default">
        <DialogHeader>
          <div className="flex items-center justify-center w-full py-2 bg-gradient-to-b from-primary/20 to-primary/50">
            <img
              src="/icon_shadow.png"
              alt="Aonsoku"
              className="w-20 h-20 drop-shadow"
            />
            <h1 className="font-semibold text-3xl drop-shadow">{name}</h1>
          </div>
        </DialogHeader>

        <div className="w-full h-full p-6 gap-6 grid grid-cols-4">
          <div className="flex flex-col gap-6 col-span-3 border-r">
            <div className="flex flex-col gap-2 h-full text-sm">
              <span className="font-medium">{t('about.client')}</span>
              <div className="flex flex-col gap-1 justify-center text-muted-foreground">
                <div className="flex gap-2">
                  <p>{t('about.version')}</p>
                  <div className="text-xs font-medium bg-primary/60 text-foreground px-2 rounded-full border border-primary flex items-center justify-center">
                    {version}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 h-full text-sm">
              <span className="font-medium">{t('about.server')}</span>
              {isLoading && <p>{t('generic.loading')}</p>}
              {server && !isLoading && (
                <div className="flex flex-col gap-1 justify-center text-muted-foreground">
                  <div className="flex gap-2">
                    <div>{t('about.type')}</div>
                    <div className="text-xs font-medium bg-primary/60 text-foreground px-2 rounded-full border border-primary flex items-center justify-center">
                      {server.type}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div>{t('about.version')}</div>
                    <div className="text-xs font-medium bg-primary/60 text-foreground px-2 rounded-full border border-primary flex items-center justify-center">
                      {server.serverVersion}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <div>{t('about.apiVersion')}</div>
                    <div className="text-xs font-medium bg-primary/60 text-foreground px-2 rounded-full border border-primary flex items-center justify-center">
                      {server.version}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div>
            {isLinux ? (
              <button
                className="w-fit px-2 py-1 rounded-md bg-primary/60 hover:bg-primary/50 border border-primary text-sm font-medium flex items-center"
                onClick={() => {
                  navigator.clipboard.writeText(url)
                  toast.success(t('about.toasts.copy'), {
                    toastId: 'clipboard',
                  })
                }}
              >
                <img
                  src="/icons/github-mark-white.svg"
                  alt="Github"
                  className="w-4 h-4 mr-2"
                />
                Github
              </button>
            ) : (
              <a
                className="w-fit px-2 py-1 rounded-md bg-primary/60 hover:bg-primary/50 border border-primary text-sm font-medium flex items-center"
                href={url}
                target="_blank"
                rel="nofollow noreferrer"
              >
                <img
                  src="/icons/github-mark-white.svg"
                  alt="Github"
                  className="w-4 h-4 mr-2"
                />
                Github
              </a>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
