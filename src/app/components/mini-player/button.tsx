import { PictureInPicture2Icon } from 'lucide-react'
import { memo, useCallback, useEffect, useState } from 'react'
import { Button } from '@/app/components/ui/button'
import { usePlayerCurrentList } from '@/store/player.store'
import { MiniPlayer } from './player'
import { MiniPlayerPortal } from './portal'

const MemoMiniPlayerPortal = memo(MiniPlayerPortal)
const MemoMiniPlayer = memo(MiniPlayer)

export function MiniPlayerButton() {
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

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleClick}
        className="rounded-full ml-2"
        disabled={disabled}
      >
        <PictureInPicture2Icon className="w-4 h-4" />
      </Button>
      <MemoMiniPlayerPortal pipWindow={pipWindow}>
        <MemoMiniPlayer />
      </MemoMiniPlayerPortal>
    </>
  )
}
