import clsx from 'clsx'
import { ListVideo } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/app/components/ui/button'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'
import {
  useLyricsState,
  useMainDrawerState,
  useQueueState,
} from '@/store/player.store'

interface PlayerSongListButtonProps {
  disabled: boolean
}

export function PlayerSongListButton({ disabled }: PlayerSongListButtonProps) {
  const { t } = useTranslation()
  const { mainDrawerState, setMainDrawerState, toggleQueueAndLyrics } =
    useMainDrawerState()
  const { queueState, setQueueState } = useQueueState()
  const { lyricsState } = useLyricsState()

  const isActive = mainDrawerState && queueState

  function handleClick() {
    if (mainDrawerState && lyricsState) {
      toggleQueueAndLyrics()
    } else {
      setQueueState(!queueState)
      setMainDrawerState(!mainDrawerState)
    }
  }

  return (
    <SimpleTooltip text={t('queue.title')}>
      <Button
        variant="ghost"
        className={clsx(
          'rounded-full w-10 h-10 p-2 text-secondary-foreground relative',
          isActive && 'player-button-active',
        )}
        disabled={disabled}
        onClick={handleClick}
      >
        <ListVideo className={clsx('w-4 h-4', isActive && 'text-primary')} />
      </Button>
    </SimpleTooltip>
  )
}
