import { useQueryClient } from '@tanstack/react-query'
import { PlusIcon, RotateCw } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/app/components/ui/button'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'
import { usePlaylists } from '@/store/playlists.store'
import { queryKeys } from '@/utils/queryKeys'

export function SidebarPlaylistButtons() {
  const { setPlaylistDialogState } = usePlaylists()
  const { t } = useTranslation()

  const queryClient = useQueryClient()

  function handleRefetch() {
    queryClient.invalidateQueries({
      queryKey: [queryKeys.playlist.all],
    })
  }

  return (
    <div className="flex items-center gap-2">
      <SimpleTooltip text={t('playlist.refresh')}>
        <Button
          size="icon"
          variant="secondary"
          className="w-6 h-6 p-[5px]"
          onClick={handleRefetch}
        >
          <RotateCw />
        </Button>
      </SimpleTooltip>

      <SimpleTooltip text={t('playlist.form.create.title')}>
        <Button
          size="icon"
          variant="default"
          className="w-6 h-6 p-[5px]"
          onClick={() => setPlaylistDialogState(true)}
        >
          <PlusIcon strokeWidth={3} />
        </Button>
      </SimpleTooltip>
    </div>
  )
}
