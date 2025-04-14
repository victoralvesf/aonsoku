import { useCallback, useLayoutEffect } from 'react'
import { useTheme } from '@/store/theme.store'
import { Theme } from '@/types/themeContext'
import { isDesktop } from '@/utils/desktop'
import { hslToHsla } from '@/utils/getAverageColor'

export const appThemes: Theme[] = Object.values(Theme)

export function ThemeObserver() {
  const { theme } = useTheme()

  const setDesktopTitleBarColors = useCallback(() => {
    if (!isDesktop()) return

    const root = window.document.documentElement
    const styles = getComputedStyle(root)

    const symbol = hslToHsla(styles.getPropertyValue('--foreground').trim())
    const color = hslToHsla(styles.getPropertyValue('--background').trim())

    window.api.setTitleBarOverlayColors({
      color,
      symbol,
    })
  }, [])

  useLayoutEffect(() => {
    const root = window.document.documentElement

    root.classList.remove(...appThemes)
    root.classList.add(theme)

    setDesktopTitleBarColors()
  }, [setDesktopTitleBarColors, theme])

  return null
}
