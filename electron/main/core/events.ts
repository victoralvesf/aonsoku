import { is, platform } from '@electron-toolkit/utils'
import { BrowserWindow, ipcMain, nativeTheme, shell } from 'electron'
import {
  IpcChannels,
  OverlayColors,
  PlayerStatePayload,
} from '../../preload/types'
import { isQuitting } from '../index'
import { tray, updateTray } from '../tray'
import { colorsState } from './colors'
import {
  clearDiscordRpcActivity,
  RpcPayload,
  setDiscordRpcActivity,
} from './discordRpc'
import { playerState } from './playerState'
import { getAppSetting, ISettingPayload, saveAppSettings } from './settings'
import { setTaskbarButtons } from './taskbar'
import { DEFAULT_TITLE_BAR_HEIGHT } from './titleBarOverlay'

export function setupEvents(window: BrowserWindow | null) {
  if (!window) return

  window.on('ready-to-show', async () => {
    window.show()
  })

  window.on('show', () => {
    setTaskbarButtons()
    updateTray()
  })

  window.on('hide', () => {
    updateTray()
  })

  window.webContents.once('did-finish-load', () => {
    nativeTheme.on('updated', () => {
      setTaskbarButtons()
    })
  })

  window.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  window.on('enter-full-screen', () => {
    window.webContents.send(IpcChannels.FullscreenStatus, true)
  })

  window.on('leave-full-screen', () => {
    window.webContents.send(IpcChannels.FullscreenStatus, false)
  })

  window.on('maximize', () => {
    window.webContents.send(IpcChannels.MaximizedStatus, true)
  })

  window.on('unmaximize', () => {
    window.webContents.send(IpcChannels.MaximizedStatus, false)
  })

  window.on('close', (event) => {
    if (isQuitting) {
      if (tray && !tray.isDestroyed()) tray.destroy()
      return
    }

    if (is.dev || !getAppSetting('minimizeToTray')) {
      if (tray && !tray.isDestroyed()) tray.destroy()
      return
    }

    event.preventDefault()
    window.hide()
  })

  window.on('page-title-updated', (_, title) => {
    updateTray(title)
  })
}

export function setupIpcEvents(window: BrowserWindow | null) {
  if (!window) return

  ipcMain.removeAllListeners()

  ipcMain.on(IpcChannels.ToggleFullscreen, (_, isFullscreen: boolean) => {
    window.setFullScreen(isFullscreen)
  })

  ipcMain.removeHandler(IpcChannels.IsFullScreen)
  ipcMain.handle(IpcChannels.IsFullScreen, () => {
    return window.isFullScreen()
  })

  ipcMain.removeHandler(IpcChannels.IsMaximized)
  ipcMain.handle(IpcChannels.IsMaximized, () => {
    return window.isMaximized()
  })

  ipcMain.on(IpcChannels.ToggleMaximize, (_, isMaximized: boolean) => {
    if (isMaximized) {
      window.unmaximize()
    } else {
      window.maximize()
    }
  })

  ipcMain.on(IpcChannels.ToggleMinimize, () => {
    window.minimize()
  })

  ipcMain.on(IpcChannels.CloseWindow, () => {
    window.close()
  })

  ipcMain.on(IpcChannels.ThemeChanged, (_, colors: OverlayColors) => {
    const { color, symbol, bgColor } = colors

    if (bgColor) {
      colorsState.set('bgColor', bgColor)
    }

    if (platform.isMacOS || platform.isLinux) return

    window.setTitleBarOverlay({
      color,
      height: DEFAULT_TITLE_BAR_HEIGHT,
      symbolColor: symbol,
    })
  })

  ipcMain.on(IpcChannels.UpdateNativeTheme, (_, isDark: boolean) => {
    nativeTheme.themeSource = isDark ? 'dark' : 'light'
  })

  ipcMain.on(
    IpcChannels.UpdatePlayerState,
    (_, payload: PlayerStatePayload) => {
      playerState.setAll(payload)

      setTimeout(() => {
        setTaskbarButtons()
        updateTray()
      }, 150)
    },
  )

  ipcMain.on(IpcChannels.SetDiscordRpcActivity, (_, payload: RpcPayload) => {
    setDiscordRpcActivity(payload)
  })

  ipcMain.on(IpcChannels.ClearDiscordRpcActivity, () => {
    clearDiscordRpcActivity()
  })

  ipcMain.on(IpcChannels.SaveAppSettings, (_, payload: ISettingPayload) => {
    saveAppSettings(payload)
  })
}
