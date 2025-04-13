import { useEffect, useState } from 'react'
import { isDesktop } from '@/utils/desktop'

interface AppWindowType {
  isFullscreen: boolean
  enterFullscreenWindow: () => Promise<void>
  exitFullscreenWindow: () => Promise<void>
}

export function useAppWindow(): AppWindowType {
  const [isFullscreen, setIsFullscreen] = useState(false)

  useEffect(() => {
    if (!isDesktop()) return

    const fetchFullscreenStatus = async () => {
      const fullscreenStatus = await window.api.isFullScreen()
      setIsFullscreen(fullscreenStatus)
    }

    fetchFullscreenStatus()

    function handleFullScreenStatus(status: boolean) {
      setIsFullscreen(status)
    }

    window.api.fullscreenStatusListener((status) => {
      handleFullScreenStatus(status)
    })

    return () => {
      window.api.fullscreenStatusListener((status) => {
        handleFullScreenStatus(status)
      })
    }
  }, [])

  const enterFullscreenWindow = async () => {
    if (!isDesktop()) return

    const fullscreen = await window.api.isFullScreen()

    if (!fullscreen) window.api.enterFullScreen()
  }

  const exitFullscreenWindow = async () => {
    if (!isDesktop()) return

    const fullscreen = await window.api.isFullScreen()

    if (fullscreen) window.api.exitFullScreen()
  }

  return {
    isFullscreen,
    enterFullscreenWindow,
    exitFullscreenWindow,
  }
}
