import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

const useNavigationHistory = () => {
  const location = useLocation()
  const navigate = useNavigate()

  const [appHistoryStack, setAppHistoryStack] = useState([location.pathname])
  const [position, setPosition] = useState(0)
  const [canGoBack, setCanGoBack] = useState(false)
  const [canGoForward, setCanGoForward] = useState(false)

  useEffect(() => {
    // Update the internal app history if the current path is not the last one in the stack
    if (appHistoryStack[position] !== location.pathname) {
      const newStack = appHistoryStack.slice(0, position + 1)
      newStack.push(location.pathname)
      setAppHistoryStack(newStack)
      setPosition(newStack.length - 1)
    }

    // Update navigation flags
    setCanGoBack(position > 0)
    setCanGoForward(position < appHistoryStack.length - 1)
  }, [location, position, appHistoryStack])

  const goBack = () => {
    if (canGoBack) {
      const newPosition = position - 1
      setPosition(newPosition)
      navigate(appHistoryStack[newPosition])
    }
  }

  const goForward = () => {
    if (canGoForward) {
      const newPosition = position + 1
      setPosition(newPosition)
      navigate(appHistoryStack[newPosition])
    }
  }

  return { canGoBack, canGoForward, goBack, goForward }
}

export default useNavigationHistory
