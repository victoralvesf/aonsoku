import { Maximize2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/app/components/ui/button'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'
import { useBigPlayerState } from '@/store/player.store'

interface PlayerExpandButtonProps {
  disabled: boolean
}

export function PlayerExpandButton({ disabled }: PlayerExpandButtonProps) {
  const { t } = useTranslation()
  const { toggleBigPlayerState } = useBigPlayerState()

  return (
    <SimpleTooltip text={t('fullscreen.switchButton')}>
      <Button
        variant="ghost"
        className="rounded-full w-10 h-10 p-3 text-secondary-foreground"
        data-testid="track-fullscreen-button"
        disabled={disabled}
        onClick={toggleBigPlayerState}
      >
        <Maximize2 data-testid="track-fullscreen-icon" />
      </Button>
    </SimpleTooltip>
  )
}
