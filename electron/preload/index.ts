import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge, ipcRenderer } from 'electron'
import { IAonsokuAPI, IpcChannels } from './api.types'

// Custom APIs for renderer
const api: IAonsokuAPI = {
  enterFullScreen: () => ipcRenderer.send(IpcChannels.ToggleFullscreen, true),
  exitFullScreen: () => ipcRenderer.send(IpcChannels.ToggleFullscreen, false),
  isFullScreen: () => ipcRenderer.invoke(IpcChannels.IsFullScreen),
  fullscreenStatusListener: (func) => {
    ipcRenderer.on(IpcChannels.FullscreenStatus, (_, status: boolean) =>
      func(status),
    )
  },
  setTitleBarOverlayColors: (color) =>
    ipcRenderer.send(IpcChannels.ThemeChanged, color),
  setNativeTheme: (isDark) =>
    ipcRenderer.send(IpcChannels.UpdateNativeTheme, isDark),
  downloadFile: (payload) =>
    ipcRenderer.send(IpcChannels.HandleDownloads, payload),
  downloadCompletedListener: (func) => {
    ipcRenderer.once(IpcChannels.DownloadCompleted, (_, fileId: string) =>
      func(fileId),
    )
  },
  downloadFailedListener: (func) => {
    ipcRenderer.once(IpcChannels.DownloadFailed, (_, fileId: string) =>
      func(fileId),
    )
  },
}

// Use `contextBridge` APIs to expose Electron APIs to
// renderer only if context isolation is enabled, otherwise
// just add to the DOM global.
if (process.contextIsolated) {
  try {
    contextBridge.exposeInMainWorld('electron', electronAPI)
    contextBridge.exposeInMainWorld('api', api)
  } catch (error) {
    console.error(error)
  }
} else {
  // @ts-expect-error (define in dts)
  window.electron = electronAPI
  // @ts-expect-error (define in dts)
  window.api = api
}
