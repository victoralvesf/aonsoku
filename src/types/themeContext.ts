export type Theme = 'dark' | 'light' | 'system'

export interface IThemeContext {
  theme: Theme
  setTheme: (theme: Theme) => void
}
