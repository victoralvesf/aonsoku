import { app, BrowserWindow, ipcMain } from 'electron'
import { download } from 'electron-dl'
import { IpcChannels } from '../../preload/types'

export interface IDownloadPayload {
  url: string
  fileId: string
}

export function setupDownloads(window: BrowserWindow | null) {
  ipcMain.on(
    IpcChannels.HandleDownloads,
    async (_, payload: IDownloadPayload) => {
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
