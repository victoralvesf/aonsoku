import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { AppIcon } from '@/app/components/app-icon'
import { MultiBadge } from '@/app/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog'
import githubIcon from '@/assets/icons/github-mark-white.svg'
import { subsonic } from '@/service/subsonic'
import { getAppInfo } from '@/utils/appName'
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
      <DialogContent
        className="p-0 overflow-hidden gap-0 cursor-default"
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">{t('menu.about')}</DialogTitle>
        <DialogHeader>
          <div className="flex gap-2 items-center justify-start w-full py-4 px-6 bg-background-foreground border-b border-border">
            <AppIcon className="size-8" />
            <h1 className="font-medium text-lg">{name}</h1>
          </div>
        </DialogHeader>

        <div className="w-full h-full p-6 gap-6 flex flex-col">
          <div className="flex flex-col gap-6">
            <div className="flex flex-col gap-2 h-full text-sm">
              <span className="text-xs font-medium">{t('about.client')}</span>
              <div className="flex flex-col gap-1 justify-center text-muted-foreground">
                <div className="flex gap-2">
                  <MultiBadge label={t('about.version')}>{version}</MultiBadge>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2 h-full text-sm">
              <span className="text-xs font-medium">{t('about.server')}</span>
              {isLoading && <p>{t('generic.loading')}</p>}
              {server && !isLoading && (
                <div className="flex gap-2 flex-wrap">
                  <MultiBadge label={t('about.type')}>{server.type}</MultiBadge>
                  <MultiBadge label={t('about.version')}>
                    {server.serverVersion}
                  </MultiBadge>
                  <MultiBadge label={t('about.apiVersion')}>
                    {server.version}
                  </MultiBadge>
                </div>
              )}
            </div>
          </div>
        </div>
        <DialogFooter className="w-full border-t border-border px-6 py-4 bg-background-foreground">
          <div className="flex justify-end">
            <a
              className="px-2 py-1 rounded-md bg-primary/60 hover:bg-primary/50 text-primary-foreground border border-primary/80 text-sm font-medium flex items-center justify-center"
              href={url}
              target="_blank"
              rel="nofollow noreferrer"
            >
              <img src={githubIcon} alt="Github" className="size-4 mr-2" />
              Github
            </a>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
