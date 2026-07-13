import { useEffect, useState } from 'react'
import { useNavigate, useNavigationType } from 'react-router-dom'
import { MouseButton } from '@/utils/browser'
import { isMacOS } from '@/utils/desktop'

const SWIPE_THRESHOLD = 60  // minimum deltaX to count as a navigation gesture
const SWIPE_COOLDOWN = 500  // ms before another swipe can fire

const useNavigationHistory = () => {
  const navigationType = useNavigationType()
  const navigate = useNavigate()

  const [canGoBack, setCanGoBack] = useState(false)
  const [canGoForward, setCanGoForward] = useState(false)

  // biome-ignore lint/correctness/useExhaustiveDependencies: using navigationType to trigger
  useEffect(() => {
    setCanGoBack(false)
    setCanGoForward(false)

    const handleHistoryChange = () => {
      setCanGoBack(window.history.state?.idx > 0)
      setCanGoForward(window.history.state?.idx < window.history.length - 1)
    }

    handleHistoryChange()

    window.addEventListener('popstate', handleHistoryChange)

    return () => {
      window.removeEventListener('popstate', handleHistoryChange)
    }
  }, [navigationType])

  const goBack = () => {
    if (canGoBack) navigate(-1)
  }

  const goForward = () => {
    if (canGoForward) navigate(1)
  }

  // Mac only: Intercept mouse back/forward buttons (3/4) for in-app navigation.
  // Reads window.history.state directly to avoid stale canGoBack/canGoForward closures.
  useEffect(() => {
    if (!isMacOS) return

    const handleMouseButtons = (e: MouseEvent) => {
      if (e.button === MouseButton.Back) {
        e.preventDefault()
        if (window.history.state?.idx > 0) navigate(-1)
      } else if (e.button === MouseButton.Forward) {
        e.preventDefault()
        if (window.history.state?.idx < window.history.length - 1) navigate(1)
      }
    }

    window.addEventListener('mousedown', handleMouseButtons)
    return () => window.removeEventListener('mousedown', handleMouseButtons)
  }, [navigate])

  // Mac only: two-finger swipe gesture for in-app navigation.
  // The wheel event fires when the trackpad produces horizontal overscroll (no
  // scrollable content to consume deltaX), which is the back/forward gesture.
  // A cooldown prevents repeated firings from a single swipe.
  useEffect(() => {
    if (!isMacOS) return

    let lastFired = 0

    const handleWheel = (e: WheelEvent) => {
      const now = Date.now()
      const isHorizontalDominant = Math.abs(e.deltaX) > Math.abs(e.deltaY)

      if (!isHorizontalDominant || Math.abs(e.deltaX) < SWIPE_THRESHOLD) return
      if (now - lastFired < SWIPE_COOLDOWN) return

      lastFired = now

      if (e.deltaX < 0 && window.history.state?.idx > 0) navigate(-1)
      if (e.deltaX > 0 && window.history.state?.idx < window.history.length - 1) navigate(1)
    }

    window.addEventListener('wheel', handleWheel, { passive: true })
    return () => window.removeEventListener('wheel', handleWheel)
  }, [navigate])

  return { canGoBack, canGoForward, goBack, goForward }
}

export default useNavigationHistory
