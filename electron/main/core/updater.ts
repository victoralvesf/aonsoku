import { BrowserWindow, ipcMain } from 'electron'
import electronUpdater from 'electron-updater'
import { IpcChannels } from '../../preload/types'

const { autoUpdater } = electronUpdater

let updateWindow: BrowserWindow | null = null

export function setUpdaterWindow(window: BrowserWindow | null) {
  updateWindow = window
}

export function initAutoUpdater() {
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
    updateWindow?.webContents.send(IpcChannels.UpdateAvailable, info)
  })

  autoUpdater.on('update-not-available', () => {
    updateWindow?.webContents.send(IpcChannels.UpdateNotAvailable)
  })

  autoUpdater.on('error', (err) => {
    updateWindow?.webContents.send(IpcChannels.UpdateError, err.message)
  })

  autoUpdater.on('download-progress', (progressObj) => {
    updateWindow?.webContents.send(IpcChannels.DownloadProgress, progressObj)
  })

  autoUpdater.on('update-downloaded', (info) => {
    updateWindow?.webContents.send(IpcChannels.UpdateDownloaded, info)
  })
}
