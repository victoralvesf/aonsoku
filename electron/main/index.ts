import { electronApp, optimizer } from '@electron-toolkit/utils'
import { app, globalShortcut } from 'electron'
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
    if (!mainWindow) {
      createWindow()
      return
    }

    if (mainWindow.isMinimized()) {
      mainWindow.restore()
    } else if (!mainWindow.isVisible()) {
      mainWindow.show()
    }

    mainWindow.focus()
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
