import { ElectronAPI } from '@electron-toolkit/preload'
import { IAonsokuAPI } from '../../electron/preload/types'

export {}

declare global {
  interface Window {
    electron: ElectronAPI
    api: IAonsokuAPI
    envVars: {
      XDG_CURRENT_DESKTOP: string | undefined
    }
  }
}
