import { getCurrentWindow, Window } from '@tauri-apps/api/window'
import { useCallback, useEffect, useState } from 'react'
import { getOsType, isWindows } from '@/utils/osType'
import { isTauri } from '@/utils/tauriTools'

interface AppWindowType {
  appWindow: Window | null
  isWindowMaximized: boolean
  isFullscreen: boolean
  minimizeWindow: () => Promise<void>
  maximizeWindow: () => Promise<void>
  toggleFullscreen: () => Promise<void>
  enterFullscreenWindow: () => Promise<void>
  exitFullscreenWindow: () => Promise<void>
  closeWindow: () => Promise<void>
}

export function useAppWindow(): AppWindowType {
  const [appWindow, setAppWindow] = useState<Window | null>(null)
  const [isWindowMaximized, setIsWindowMaximized] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [stateBeforeFullscreen, setStateBeforeFullscreen] = useState(false)

  useEffect(() => {
    const fetchFullscreenStatus = async () => {
      if (appWindow) {
        const fullscreenStatus = await appWindow.isFullscreen()
        setIsFullscreen(fullscreenStatus)
      }
    }

    fetchFullscreenStatus()
  }, [appWindow])

  useEffect(() => {
    if (typeof window !== 'undefined' && isTauri()) {
      setAppWindow(getCurrentWindow())
    }
  }, [])

  // Update the isWindowMaximized state when the window is resized
  const updateIsWindowMaximized = useCallback(async () => {
    if (appWindow) {
      const _isWindowMaximized = await appWindow.isMaximized()
      setIsWindowMaximized(_isWindowMaximized)
    }
  }, [appWindow])

  const updateIsFullscreen = useCallback(async () => {
    if (appWindow) {
      const _isFullscreen = await appWindow.isFullscreen()
      setIsFullscreen(_isFullscreen)
    }
  }, [appWindow])

  useEffect(() => {
    if (!isTauri()) return

    getOsType().then(() => {
      updateIsWindowMaximized()
      updateIsFullscreen()
      let unlisten: () => void = () => {}

      const listen = async () => {
        if (appWindow) {
          unlisten = await appWindow.onResized(() => {
            updateIsWindowMaximized()
            updateIsFullscreen()
          })
        }
      }
      listen()

      // Cleanup the listener when the component unmounts
      return () => unlisten && unlisten()
    })
  }, [appWindow, updateIsFullscreen, updateIsWindowMaximized])

  const minimizeWindow = async () => {
    if (appWindow) {
      await appWindow.minimize()
    }
  }

  const maximizeWindow = async () => {
    if (appWindow) {
      await appWindow.toggleMaximize()
    }
  }

  const toggleFullscreen = async () => {
    if (appWindow) {
      const fullscreen = await appWindow.isFullscreen()
      fullscreen ? exitFullscreenWindow() : enterFullscreenWindow()
    }
  }

  const enterFullscreenWindow = async () => {
    if (appWindow) {
      const fullscreen = await appWindow.isFullscreen()
      if (!fullscreen) {
        // Hack to make the app go fullscreen on Windows
        setStateBeforeFullscreen(isWindowMaximized)
        if (isWindows && isWindowMaximized) {
          await maximizeWindow()
        }

        await appWindow.setFullscreen(true)
        updateIsFullscreen()
      }
    }
  }

  const exitFullscreenWindow = async () => {
    if (appWindow) {
      const fullscreen = await appWindow.isFullscreen()
      if (fullscreen) {
        await appWindow.setFullscreen(false)
        updateIsFullscreen()

        if (isWindows && stateBeforeFullscreen) {
          await maximizeWindow()
        }
      }
    }
  }

  const closeWindow = async () => {
    if (appWindow) {
      await appWindow.close()
    }
  }

  return {
    appWindow,
    isWindowMaximized,
    isFullscreen,
    minimizeWindow,
    maximizeWindow,
    closeWindow,
    toggleFullscreen,
    enterFullscreenWindow,
    exitFullscreenWindow,
  }
}
