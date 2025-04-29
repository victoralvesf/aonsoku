import { is, platform } from '@electron-toolkit/utils'
import { BrowserWindow } from 'electron'
import { join } from 'path'
import { setupDownloads } from './core/downloads'
import { setupEvents, setupIpcEvents } from './core/events'
import { appIcon } from './core/icon'
import { titleBarOverlay } from './core/titleBarOverlay'
import { StatefulBrowserWindow } from './core/windowPosition'

export let mainWindow: BrowserWindow | null = null

export function createWindow(): void {
  mainWindow = new StatefulBrowserWindow({
    width: 1280,
    height: 720,
    minWidth: 1280,
    minHeight: 720,
    supportMaximize: true,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
    visualEffectState: 'followWindow',
    roundedCorners: true,
    frame: false,
    ...(platform.isWindows ? { titleBarOverlay } : {}),
    trafficLightPosition: { x: 15, y: 14 },
    icon: appIcon(),
    webPreferences: {
      preload: join(__dirname, '../preload/index.mjs'),
      sandbox: false,
    },
  })

  setupEvents(mainWindow)
  setupIpcEvents(mainWindow)
  setupDownloads(mainWindow)

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'), {
      hash: '/',
    })
  }
}
