export type Theme = 'dark' | 'light' | 'black'

export interface IThemeContext {
  theme: Theme
  setTheme: (theme: Theme) => void
}
