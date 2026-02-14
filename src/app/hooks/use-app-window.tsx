import { AnimationEvent, useEffect, useState } from 'react'
import { useFullscreenPlayerSettings } from '@/store/player.store'
import { enterFullscreen, exitFullscreen } from '@/utils/browser'
import { isDesktop } from '@/utils/desktop'
import { setDesktopTitleBarColors } from '@/utils/theme'

interface AppWindowType {
  isFullscreen: boolean
  isMaximized: boolean
  enterFullscreenWindow: () => Promise<void>
  exitFullscreenWindow: () => Promise<void>
  maximizeWindow: () => void
  minimizeWindow: () => void
  closeWindow: () => void
  handleFullscreen: (playerStatus: boolean) => Promise<void>
  handleDrawerAnimationEnd: (event: AnimationEvent<HTMLDivElement>) => void
}

export function useAppWindow(): AppWindowType {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMaximized, setIsMaximized] = useState(false)
  const { autoFullscreenEnabled } = useFullscreenPlayerSettings()

  useEffect(() => {
    if (!isDesktop()) return

    const fetchWindowStatus = async () => {
      const [fullscreenStatus, maximizedStatus] = await Promise.all([
        window.api.isFullScreen(),
        window.api.isMaximized(),
      ])
      setIsFullscreen(fullscreenStatus)
      setIsMaximized(maximizedStatus)
    }

    fetchWindowStatus()

    function handleFullScreenStatus(status: boolean) {
      setIsFullscreen(status)
    }

    window.api.fullscreenStatusListener(handleFullScreenStatus)

    function handleMaximizedStatus(status: boolean) {
      setIsMaximized(status)
    }

    window.api.maximizedStatusListener(handleMaximizedStatus)

    return () => {
      window.api.removeFullscreenStatusListener()
      window.api.removeMaximizedStatusListener()
    }
  }, [])

  const enterFullscreenWindow = async () => {
    if (!isDesktop()) return

    const fullscreen = await window.api.isFullScreen()

    if (!fullscreen) {
      window.api.enterFullScreen()
      setIsFullscreen(true)
    }
  }

  const exitFullscreenWindow = async () => {
    if (!isDesktop()) return

    const fullscreen = await window.api.isFullScreen()

    if (fullscreen) {
      window.api.exitFullScreen()
      setIsFullscreen(false)
    }
  }

  const maximizeWindow = () => {
    if (!isDesktop()) return

    window.api.toggleMaximize(isMaximized)
  }

  const minimizeWindow = () => {
    if (!isDesktop()) return

    window.api.toggleMinimize()
  }

  const closeWindow = () => {
    if (!isDesktop()) return

    window.api.closeWindow()
  }

  const handleFullscreen = async (playerStatus: boolean) => {
    // We set title bar colors to transparent,
    // to not "unstyle" the big player appearance
    if (isDesktop()) setDesktopTitleBarColors(playerStatus)

    if (!autoFullscreenEnabled) return

    if (isDesktop()) {
      playerStatus
        ? await enterFullscreenWindow()
        : await exitFullscreenWindow()
      return
    }

    playerStatus ? enterFullscreen() : exitFullscreen()
  }

  const handleDrawerAnimationEnd = (event: AnimationEvent<HTMLDivElement>) => {
    if (event.target !== event.currentTarget) return

    const state = event.currentTarget.getAttribute('data-state')
    const isOpen = state === 'open'

    handleFullscreen(isOpen)
  }

  return {
    isFullscreen,
    isMaximized,
    enterFullscreenWindow,
    exitFullscreenWindow,
    maximizeWindow,
    minimizeWindow,
    closeWindow,
    handleFullscreen,
    handleDrawerAnimationEnd,
  }
}
