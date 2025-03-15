import { PictureInPicture2Icon } from 'lucide-react'
import { useCallback, useEffect, useState } from 'react'
import { Button } from '@/app/components/ui/button'
import { MiniPlayer } from './player'
import { MiniPlayerPortal } from './portal'

export function MiniPlayerButton() {
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

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleClick}
        className="rounded-full ml-2"
      >
        <PictureInPicture2Icon className="w-4 h-4" />
      </Button>
      <MiniPlayerPortal pipWindow={pipWindow}>
        <MiniPlayer />
      </MiniPlayerPortal>
    </>
  )
}
