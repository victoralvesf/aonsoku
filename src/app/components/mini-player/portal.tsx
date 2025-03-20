import { PropsWithChildren, useEffect } from 'react'
import { createPortal } from 'react-dom'
import { appThemes } from '@/app/observers/theme-observer'
import { useTheme } from '@/store/theme.store'
import { Theme } from '@/types/themeContext'

type PortalProps = PropsWithChildren<{
  pipWindow: Window | null
}>

export function MiniPlayerPortal({ pipWindow, children }: PortalProps) {
  const { theme } = useTheme()

  useEffect(() => {
    if (pipWindow) {
      setAppTheme(theme, pipWindow)
      replaceHead(pipWindow)
    }
  }, [pipWindow, theme])

  if (!pipWindow) return null

  return createPortal(children, pipWindow.document.body)
}

function setAppTheme(theme: Theme, pipWindow: Window) {
  pipWindow.document.documentElement.classList.remove(...appThemes)

  pipWindow.document.documentElement.classList.add(theme)
}

function replaceHead(pipWindow: Window) {
  pipWindow.document.head.innerHTML = document.head.innerHTML
}
