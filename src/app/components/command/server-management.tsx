import { useMutation, useQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Badge } from '@/app/components/ui/badge'
import { CommandGroup, CommandItem } from '@/app/components/ui/command'
import { subsonic } from '@/service/subsonic'
import { useAppStore } from '@/store/app.store'
import dateTime from '@/utils/dateTime'
import { checkServerType } from '@/utils/servers'

async function delayedFn<T>(callback: () => T): Promise<T> {
  await new Promise((resolve) => setTimeout(resolve, 1000))

  return await callback()
}

const getScanStatus = async () => {
  return await delayedFn(subsonic.library.getScanStatus)
}
const startScan = async () => {
  return await delayedFn(subsonic.library.startScan)
}

export function CommandServer() {
  const { t } = useTranslation()
  const { isLms } = checkServerType()

  const {
    data: scanStatus,
    isLoading,
    isFetching,
    refetch,
  } = useQuery({
    queryKey: ['server-get-scan-status'],
    queryFn: getScanStatus,
  })

  const lastScanDate = scanStatus
    ? dateTime(scanStatus.lastScan).format('LLL')
    : ''

  const { mutateAsync, isPending } = useMutation({
    mutationKey: ['server-start-scan'],
    mutationFn: startScan,
    onSuccess: async () => {
      useAppStore.setState((state) => {
        state.data.songCount = null
      })
    },
  })

  async function handleStartScan() {
    await mutateAsync()
  }

  const showLoader = isLoading || isFetching || isPending
  const showBadges = !showLoader && scanStatus && !isLms

  return (
    <CommandGroup heading={t('server.management')}>
      {showLoader && (
        <div className="flex justify-center items-center p-2 mb-2 h-[68px]">
          <Loader2 className="h-4 w-4 animate-spin" />
        </div>
      )}
      {showBadges && (
        <div className="flex flex-col gap-2 p-2 mb-2">
          <div className="flex gap-2 flex-wrap">
            {scanStatus.count && (
              <Badge variant="neutral">
                {t('server.songCount', {
                  count: parseInt(scanStatus.count),
                })}
              </Badge>
            )}
            {scanStatus.folderCount && (
              <Badge variant="neutral">
                {t('server.folderCount', {
                  count: parseInt(scanStatus.folderCount),
                })}
              </Badge>
            )}
            {scanStatus.lastScan && (
              <Badge variant="neutral">
                {t('server.lastScan', {
                  date: lastScanDate,
                })}
              </Badge>
            )}
          </div>
        </div>
      )}
      <CommandItem disabled={showLoader} onSelect={() => refetch()}>
        {t('server.buttons.refresh')}
      </CommandItem>
      <CommandItem disabled={showLoader} onSelect={() => handleStartScan()}>
        {t('server.buttons.startScan')}
      </CommandItem>
    </CommandGroup>
  )
}
