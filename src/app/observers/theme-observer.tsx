import { useEffect } from 'react'
import { useTheme } from '@/store/theme.store'

export function ThemeObserver() {
  const { theme } = useTheme()

  useEffect(() => {
    const root = window.document.documentElement
    const systemThemeQuery = window.matchMedia('(prefers-color-scheme: dark)')

    const updateTheme = () => {
      root.classList.remove('light', 'dark')

      if (theme === 'system') {
        const systemTheme = systemThemeQuery.matches ? 'dark' : 'light'
        root.classList.add(systemTheme)
      } else {
        root.classList.add(theme)
      }
    }

    // Atualizar o tema ao montar o componente
    updateTheme()

    // Escutar mudanças no tema do sistema
    if (theme === 'system') {
      systemThemeQuery.addEventListener('change', updateTheme)
    }

    // Limpeza do listener
    return () => {
      systemThemeQuery.removeEventListener('change', updateTheme)
    }
  }, [theme])

  return null
}
