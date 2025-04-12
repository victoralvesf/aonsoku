import { electronAPI } from '@electron-toolkit/preload'
import { contextBridge, ipcRenderer } from 'electron'
import { IAonsokuAPI } from './api.types'

// Custom APIs for renderer
const api: IAonsokuAPI = {
  enterFullScreen: () => ipcRenderer.send('toggle-fullscreen', true),
  exitFullScreen: () => ipcRenderer.send('toggle-fullscreen', false),
  isFullScreen: () => ipcRenderer.invoke('is-fullscreen'),
  receive: (channel, func) => {
    ipcRenderer.on(channel, (_, ...args) => func(args))
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
