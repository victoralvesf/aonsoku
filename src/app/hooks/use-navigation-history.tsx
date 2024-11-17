import { useState, useEffect } from 'react'
import { useNavigate, useNavigationType } from 'react-router-dom'

const useNavigationHistory = () => {
  const navigationType = useNavigationType()
  const navigate = useNavigate()

  const [canGoBack, setCanGoBack] = useState(false)
  const [canGoForward, setCanGoForward] = useState(false)

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

  return { canGoBack, canGoForward, goBack, goForward }
}

export default useNavigationHistory
