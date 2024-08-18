import { PlusIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/app/components/ui/button'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'
import { usePlaylists } from '@/store/playlists.store'

export function SidebarPlaylistButtons() {
  const { setPlaylistDialogState } = usePlaylists()
  const { t } = useTranslation()

  return (
    <div className="flex items-center gap-2">
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
