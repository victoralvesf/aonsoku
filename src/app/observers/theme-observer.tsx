import { useLayoutEffect } from 'react'
import { useTheme } from '@/store/theme.store'
import { Theme } from '@/types/themeContext'

export const appThemes: Theme[] = Object.values(Theme)

export function ThemeObserver() {
  const { theme } = useTheme()

  useLayoutEffect(() => {
    const root = window.document.documentElement

    root.classList.remove(...appThemes)
    root.classList.add(theme)
  }, [theme])

  return null
}
