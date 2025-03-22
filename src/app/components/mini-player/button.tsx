import clsx from 'clsx'
import { PictureInPicture2Icon } from 'lucide-react'
import { memo, useCallback, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/app/components/ui/button'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'
import { usePlayerCurrentList } from '@/store/player.store'
import { MiniPlayer } from './player'
import { MiniPlayerPortal } from './portal'

const MemoMiniPlayerPortal = memo(MiniPlayerPortal)
const MemoMiniPlayer = memo(MiniPlayer)

export function MiniPlayerButton() {
  const { t } = useTranslation()
  const currentList = usePlayerCurrentList()
  const [pipWindow, setPipWindow] = useState<Window | null>(
    window.documentPictureInPicture.window,
  )

  const handleClick = useCallback(async () => {
    if (pipWindow) {
      pipWindow.close()
    } else {
      const newWindow = await window.documentPictureInPicture.requestWindow({
        width: 300,
        height: 300,
      })
      setPipWindow(newWindow)
    }
  }, [pipWindow])

  useEffect(() => {
    const handleWindowClose = (): void => {
      setPipWindow(null)
    }

    pipWindow?.addEventListener('pagehide', handleWindowClose)

    return () => {
      pipWindow?.removeEventListener('pagehide', handleWindowClose)
    }
  }, [pipWindow])

  const disabled = currentList.length === 0

  const buttonTooltip = pipWindow
    ? t('player.tooltips.miniPlayer.close')
    : t('player.tooltips.miniPlayer.open')

  return (
    <>
      <SimpleTooltip text={buttonTooltip}>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleClick}
          className={clsx(
            'relative rounded-full',
            pipWindow && 'text-primary hover:text-primary player-button-active',
          )}
          onFocus={(e) => e.preventDefault()}
          disabled={disabled}
        >
          <PictureInPicture2Icon className="w-4 h-4" />
        </Button>
      </SimpleTooltip>
      <MemoMiniPlayerPortal pipWindow={pipWindow}>
        <MemoMiniPlayer />
      </MemoMiniPlayerPortal>
    </>
  )
}
