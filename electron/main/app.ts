import { is } from '@electron-toolkit/utils'
import { BrowserWindow } from 'electron'
import { join } from 'path'
import { setupDownloads } from './core/downloads'
import { setupEvents, setupIpcEvents } from './core/events'
import { appIcon } from './core/icon'
import { titleBarOverlay } from './core/titleBarOverlay'

export let mainWindow: BrowserWindow | null = null

export function createWindow(): void {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 1280,
    minHeight: 720,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    visualEffectState: 'followWindow',
    roundedCorners: true,
    frame: false,
    ...(process.platform !== 'darwin' ? { titleBarOverlay } : {}),
    icon: appIcon(),
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false,
    },
  })

  setupEvents(mainWindow)
  setupIpcEvents(mainWindow)
  setupDownloads()

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    mainWindow.loadFile(join(__dirname, '../../index.html'))
  }
}
