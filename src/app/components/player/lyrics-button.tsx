import clsx from 'clsx'
import { MicVocalIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/app/components/ui/button'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'
import {
  useLyricsState,
  useMainDrawerState,
  useQueueState,
} from '@/store/player.store'

interface PlayerLyricsButtonProps {
  disabled?: boolean
}

export function PlayerLyricsButton({ disabled }: PlayerLyricsButtonProps) {
  const { t } = useTranslation()
  const { mainDrawerState, setMainDrawerState, toggleQueueAndLyrics } =
    useMainDrawerState()
  const { lyricsState, setLyricsState } = useLyricsState()
  const { queueState } = useQueueState()

  const isActive = mainDrawerState && lyricsState

  function handleClick() {
    if (mainDrawerState && queueState) {
      toggleQueueAndLyrics()
    } else {
      setLyricsState(!lyricsState)
      setMainDrawerState(!mainDrawerState)
    }
  }

  return (
    <SimpleTooltip text={t('fullscreen.lyrics')}>
      <Button
        variant="ghost"
        size="icon"
        className={clsx(
          'rounded-full w-10 h-10 p-2 text-secondary-foreground relative',
          isActive && 'player-button-active text-primary',
        )}
        onClick={handleClick}
        disabled={disabled}
      >
        <MicVocalIcon className="w-4 h-4" />
      </Button>
    </SimpleTooltip>
  )
}
