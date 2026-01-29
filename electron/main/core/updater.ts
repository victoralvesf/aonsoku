import { is } from '@electron-toolkit/utils'
import { BrowserWindow, ipcMain } from 'electron'
import electronUpdater from 'electron-updater'
import { IpcChannels } from '../../preload/types'

const { autoUpdater } = electronUpdater

export function setupUpdater(window: BrowserWindow | null) {
  if (!window) return

  autoUpdater.autoDownload = false
  autoUpdater.autoInstallOnAppQuit = true

  // IPC Handlers
  ipcMain.handle(IpcChannels.CheckForUpdates, async () => {
    if (is.dev) {
      // add mock up response
      return {
        files: [
          {
            url: 'https://github.com/victoralvesf/aonsoku/releases/download/v0.11.0/Aonsoku-v0.11.0-linux-x86_64.AppImage',
            sha512:
              'QRsm6JGcGxiFzngU5VK9LhN7AJlO1mTjXpZBpUFIb7CmmNyWtH7nmT+YjaaeHVdBLCQJRGZna6U9ZCVfag8CiA==',
            size: 126846979,
            blockMapSize: 133143,
          },
        ],
        version: '9.99.9',
        updateUrl: 'https://github.com/victoralvesf/aonsoku/releases',
        releaseDate: '2025-11-30T02:45:24.024Z',
        releaseNotes:
          '## New version available\n\n- New feature 1\n- New feature 2\n\n### Fixes\n\n- Fix 1\n- Fix 2',
      }
    }

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
