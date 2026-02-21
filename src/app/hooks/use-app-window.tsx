import { AnimationEvent, useEffect, useReducer } from 'react'
import { useFullscreenPlayerSettings } from '@/store/player.store'
import { enterFullscreen, exitFullscreen } from '@/utils/browser'
import { isDesktop } from '@/utils/desktop'
import { setDesktopTitleBarColors } from '@/utils/theme'

interface WindowState {
  isFullscreen: boolean
  isMaximized: boolean
}

type WindowAction =
  | { type: 'SET_FULLSCREEN'; payload: boolean }
  | { type: 'SET_MAXIMIZED'; payload: boolean }
  | { type: 'SET_BOTH'; payload: WindowState }

const windowReducer = (
  state: WindowState,
  action: WindowAction,
): WindowState => {
  switch (action.type) {
    case 'SET_FULLSCREEN':
      return { ...state, isFullscreen: action.payload }
    case 'SET_MAXIMIZED':
      return { ...state, isMaximized: action.payload }
    case 'SET_BOTH':
      return { ...state, ...action.payload }
    default:
      return state
  }
}

interface AppWindowType extends WindowState {
  enterFullscreenWindow: () => Promise<void>
  exitFullscreenWindow: () => Promise<void>
  maximizeWindow: () => void
  minimizeWindow: () => void
  closeWindow: () => void
  handleFullscreen: (playerStatus: boolean) => Promise<void>
  handleDrawerAnimationEnd: (event: AnimationEvent<HTMLDivElement>) => void
}

export function useAppWindow(): AppWindowType {
  const [{ isFullscreen, isMaximized }, dispatch] = useReducer(windowReducer, {
    isFullscreen: false,
    isMaximized: false,
  })
  const { autoFullscreenEnabled } = useFullscreenPlayerSettings()

  useEffect(() => {
    if (!isDesktop()) return

    const fetchWindowStatus = async () => {
      const [fullscreenStatus, maximizedStatus] = await Promise.all([
        window.api.isFullScreen(),
        window.api.isMaximized(),
      ])

      dispatch({
        type: 'SET_BOTH',
        payload: {
          isFullscreen: fullscreenStatus,
          isMaximized: maximizedStatus,
        },
      })
    }

    fetchWindowStatus()

    function handleFullScreenStatus(status: boolean) {
      dispatch({ type: 'SET_FULLSCREEN', payload: status })
    }

    window.api.fullscreenStatusListener(handleFullScreenStatus)

    function handleMaximizedStatus(status: boolean) {
      dispatch({ type: 'SET_MAXIMIZED', payload: status })
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
      dispatch({ type: 'SET_FULLSCREEN', payload: true })
    }
  }

  const exitFullscreenWindow = async () => {
    if (!isDesktop()) return

    const fullscreen = await window.api.isFullScreen()

    if (fullscreen) {
      window.api.exitFullScreen()
      dispatch({ type: 'SET_FULLSCREEN', payload: false })
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
