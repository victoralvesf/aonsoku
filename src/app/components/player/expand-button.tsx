import { Expand } from 'lucide-react'
import FullscreenMode from '@/app/components/fullscreen/page'
import { useTranslation } from 'react-i18next'
import { Button } from '@/app/components/ui/button'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'

interface PlayerExpandButtonProps {
  disabled: boolean
}

export function PlayerExpandButton({}: PlayerExpandButtonProps) {
  const { t } = useTranslation()

  return (
    <SimpleTooltip text={t('fullscreen.switchButton')}>
        <FullscreenMode>
            <Button
                variant="ghost"
                className="rounded-full w-10 h-10 p-3 text-secondary-foreground"
                data-testid="player-expand-button"
            >
                <Expand
                data-testid="player-expand-icon"
                />
            </Button>
      </FullscreenMode>
    </SimpleTooltip>
  )
}
