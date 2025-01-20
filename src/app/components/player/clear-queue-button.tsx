import { ListXIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/app/components/ui/button'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'
import { usePlayerActions } from '@/store/player.store'

interface PlayerClearQueueButtonProps {
  disabled: boolean
}

export function PlayerClearQueueButton({
  disabled,
}: PlayerClearQueueButtonProps) {
  const { t } = useTranslation()
  const { clearPlayerState } = usePlayerActions()

  return (
    <SimpleTooltip text={t('queue.clear')}>
      <Button
        variant="ghost"
        className="rounded-full w-10 h-10 p-2 text-secondary-foreground"
        disabled={disabled}
        onClick={clearPlayerState}
      >
        <ListXIcon className="w-4 h-4" />
      </Button>
    </SimpleTooltip>
  )
}
