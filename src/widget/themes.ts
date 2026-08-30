import { CSSProperties } from 'react'
import { WidgetTheme } from '@/types/widget'

// The widget deliberately does not reuse the app's `themes.css` custom
// properties: it must render identically regardless of the theme the user
// picked inside Aonsoku. These tokens are applied inline so the very same
// component works both in the standalone bundle and in the settings preview.
type ThemeTokens = {
  '--w-bg': string
  '--w-fg': string
  '--w-muted': string
  '--w-accent': string
  '--w-track': string
  '--w-shadow': string
  '--w-text-shadow': string
}

const themes: Record<WidgetTheme, ThemeTokens> = {
  light: {
    '--w-bg': '#ffffff',
    '--w-fg': '#12151c',
    '--w-muted': '#5b6270',
    '--w-accent': '#20b358',
    '--w-track': 'rgba(18, 21, 28, 0.12)',
    '--w-shadow': '0 8px 24px rgba(0, 0, 0, 0.12)',
    '--w-text-shadow': 'none',
  },
  dark: {
    '--w-bg': '#12151c',
    '--w-fg': '#e7e9ee',
    '--w-muted': '#9aa1b1',
    '--w-accent': '#20b358',
    '--w-track': 'rgba(231, 233, 238, 0.16)',
    '--w-shadow': '0 8px 24px rgba(0, 0, 0, 0.35)',
    '--w-text-shadow': 'none',
  },
  transparent: {
    '--w-bg': 'transparent',
    '--w-fg': '#ffffff',
    '--w-muted': 'rgba(255, 255, 255, 0.78)',
    '--w-accent': '#ffffff',
    // Dark rather than translucent white: a white-on-white progress track
    // disappears completely over bright footage.
    '--w-track': 'rgba(0, 0, 0, 0.45)',
    '--w-shadow': 'none',
    // Streams put the widget on top of unpredictable footage, so the text
    // carries its own contrast instead of relying on a background.
    '--w-text-shadow': '0 1px 3px rgba(0, 0, 0, 0.85)',
  },
}

export function getWidgetThemeStyle(theme: WidgetTheme): CSSProperties {
  return themes[theme] as CSSProperties
}
