import { electronApp, optimizer } from '@electron-toolkit/utils'
import { app, BrowserWindow, globalShortcut } from 'electron'
import { createWindow, mainWindow } from './app'
import { createTray } from './tray'

const instanceLock = app.requestSingleInstanceLock()

if (!instanceLock) {
  app.quit()
} else {
  app.on('second-instance', () => {
    if (!mainWindow) return

    if (mainWindow.isMinimized()) mainWindow.restore()

    mainWindow.focus()
  })

  app.whenReady().then(() => {
    electronApp.setAppUserModelId('com.victoralvesf.aonsoku')

    createWindow()
    createTray()
  })

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow()
  })

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
    globalShortcut.register('F11', () => {})
  })

  app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })
}
