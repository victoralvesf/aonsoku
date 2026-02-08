import { BrowserWindow, ipcMain } from 'electron'
import electronUpdater from 'electron-updater'
import { IpcChannels } from '../../preload/types'

const { autoUpdater } = electronUpdater

export function setupUpdater(window: BrowserWindow | null) {
  if (!window) return

  autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = true
  autoUpdater.forceDevUpdateConfig = false

  // IPC Handlers
  ipcMain.handle(IpcChannels.CheckForUpdates, async () => {
    try {
      return await autoUpdater.checkForUpdates()
    } catch (e) {
      console.error('Failed to check for updates:', e)
      return null
    }
  })

  ipcMain.on(IpcChannels.DownloadUpdate, () => {
    autoUpdater.downloadUpdate()
  })

  ipcMain.on(IpcChannels.QuitAndInstall, () => {
    autoUpdater.quitAndInstall()
  })

  // Updater Events
  autoUpdater.on('checking-for-update', () => {
    // Optional: notify renderer if needed
  })

  autoUpdater.on('update-available', (info) => {
    window.webContents.send(IpcChannels.UpdateAvailable, info)
  })

  autoUpdater.on('update-not-available', () => {
    window.webContents.send(IpcChannels.UpdateNotAvailable)
  })

  autoUpdater.on('error', (err) => {
    window.webContents.send(IpcChannels.UpdateError, err.message)
  })

  autoUpdater.on('download-progress', (progressObj) => {
    window.webContents.send(IpcChannels.DownloadProgress, progressObj)
  })

  autoUpdater.on('update-downloaded', (info) => {
    window.webContents.send(IpcChannels.UpdateDownloaded, info)
  })
}
