import { shell, BrowserWindow, nativeTheme, ipcMain } from 'electron'
import { setTaskbarButtons } from './taskbar'
import { DEFAULT_TITLE_BAR_HEIGHT } from './titleBarOverlay'
import { IpcChannels, OverlayColors } from '../../preload/types'

export function setupEvents(window: BrowserWindow | null) {
  if (!window) return

  window.on('ready-to-show', async () => {
    window.show()
  })

  nativeTheme.on('updated', () => {
    setTaskbarButtons(window)
  })

  window.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  window.webContents.once('did-finish-load', () => {
    setTaskbarButtons(window)
  })

  window.on('enter-full-screen', () => {
    window.webContents.send(IpcChannels.FullscreenStatus, true)
  })

  window.on('leave-full-screen', () => {
    window.webContents.send(IpcChannels.FullscreenStatus, false)
  })
}

export function setupIpcEvents(window: BrowserWindow | null) {
  if (!window) return

  ipcMain.on(IpcChannels.ToggleFullscreen, (_, isFullscreen: boolean) => {
    window.setFullScreen(isFullscreen)
  })

  ipcMain.handle(IpcChannels.IsFullScreen, () => {
    return window.isFullScreen()
  })

  ipcMain.on(IpcChannels.ThemeChanged, (_, colors: OverlayColors) => {
    const { color, symbol } = colors

    window.setTitleBarOverlay({
      color,
      height: DEFAULT_TITLE_BAR_HEIGHT,
      symbolColor: symbol,
    })
  })

  ipcMain.on(IpcChannels.UpdateNativeTheme, (_, isDark: boolean) => {
    nativeTheme.themeSource = isDark ? 'dark' : 'light'
  })
}
