export enum IpcChannels {
  FullscreenStatus = 'fullscreen-status',
  ToggleFullscreen = 'toggle-fullscreen',
  IsFullScreen = 'is-fullscreen',
  ThemeChanged = 'theme-changed',
  UpdateNativeTheme = 'update-native-theme',
}

export type OverlayColors = {
  color: string
  symbol: string
}

export interface IAonsokuAPI {
  enterFullScreen: () => void
  exitFullScreen: () => void
  isFullScreen: () => Promise<boolean>
  fullscreenStatusListener: (func: (status: boolean) => void) => void
  setTitleBarOverlayColors: (colors: OverlayColors) => void
  setNativeTheme: (isDark: boolean) => void
}
