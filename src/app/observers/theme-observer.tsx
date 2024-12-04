import { useEffect } from 'react'
import { useTheme } from '@/store/theme.store'
import { Theme } from '@/types/themeContext'

export const appThemes: Theme[] = ['light', 'dark', 'black']

export function ThemeObserver() {
  const { theme } = useTheme()

  useEffect(() => {
    const root = window.document.documentElement

    root.classList.remove(...appThemes)

    root.classList.add(theme)
  }, [theme])

  return null
}
