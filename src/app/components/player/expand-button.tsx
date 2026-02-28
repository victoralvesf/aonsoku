import { Maximize2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/app/components/ui/button'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'
import { usePlayerFullscreen } from '@/store/player.store'

interface PlayerExpandButtonProps {
  disabled: boolean
}

export function PlayerExpandButton({ disabled }: PlayerExpandButtonProps) {
  const { t } = useTranslation()
  const { setIsFullscreen } = usePlayerFullscreen()

  return (
    <Button
      variant="ghost"
      className="rounded-full w-10 h-10 p-0 text-secondary-foreground"
      data-testid="track-fullscreen-button"
      disabled={disabled}
      onClick={() => setIsFullscreen(true)}
    >
      <SimpleTooltip text={t('fullscreen.switchButton')}>
        <div className="size-full p-3 flex items-center justify-center">
          <Maximize2 data-testid="track-fullscreen-icon" />
        </div>
      </SimpleTooltip>
    </Button>
  )
}
