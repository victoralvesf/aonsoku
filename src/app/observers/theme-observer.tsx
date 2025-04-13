import { useCallback, useLayoutEffect } from 'react'
import { useTheme } from '@/store/theme.store'
import { Theme } from '@/types/themeContext'
import { isDesktop } from '@/utils/desktop'
import { hslToHsla, isDarkColor } from '@/utils/getAverageColor'

export const appThemes: Theme[] = Object.values(Theme)

export function ThemeObserver() {
  const { theme } = useTheme()

  const setNativeTheme = useCallback(() => {
    if (!isDesktop()) return

    const root = window.document.documentElement

    const rootStyles = getComputedStyle(root)
    const bgColorHsl = rootStyles.getPropertyValue('--background').trim()
    const isDarkerTheme = isDarkColor(bgColorHsl)

    window.api.setNativeTheme(isDarkerTheme)
  }, [])

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

    setNativeTheme()
    setDesktopTitleBarColors()
  }, [setDesktopTitleBarColors, setNativeTheme, theme])

  return null
}
