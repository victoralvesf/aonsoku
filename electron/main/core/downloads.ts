import { app, BrowserWindow, ipcMain } from 'electron'
import { download } from 'electron-dl'
import { IpcChannels } from '../../preload/api.types'

export interface IDownloadPayload {
  url: string
  fileId: string
}

export function setupDownloads() {
  ipcMain.on(
    IpcChannels.HandleDownloads,
    async (_, payload: IDownloadPayload) => {
      const window = BrowserWindow.getFocusedWindow()
      if (!window) return

      const { url, fileId } = payload

      try {
        const downloadsPath = app.getPath('downloads')

        await download(window, url, {
          directory: downloadsPath,
          onCompleted: () => {
            window.webContents.send(IpcChannels.DownloadCompleted, fileId)
          },
        })
      } catch {
        window.webContents.send(IpcChannels.DownloadFailed, fileId)
      }
    },
  )
}
