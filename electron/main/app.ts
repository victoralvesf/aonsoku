import { is } from '@electron-toolkit/utils'
import {
  shell,
  BrowserWindow,
  nativeImage,
  nativeTheme,
  ipcMain,
} from 'electron'
import { join } from 'path'
import { setTaskbarButtons } from './taskbar'

function appIcon() {
  let icon = 'icon.png'

  if (process.platform === 'win32') icon = 'icon.ico'
  if (process.platform === 'darwin') icon = 'icon.icns'

  return nativeImage.createFromPath(join(__dirname, '../../build', icon))
}

const titleBarOverlay: Electron.TitleBarOverlay = {
  color: '#00000000',
  symbolColor: '#ffffff',
  height: 43,
}

export function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
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

  mainWindow.on('ready-to-show', async () => {
    mainWindow.show()
  })

  mainWindow.webContents.once('did-finish-load', () => {
    setTaskbarButtons(mainWindow)

    nativeTheme.on('updated', () => {
      setTaskbarButtons(mainWindow)
    })
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  mainWindow.on('enter-full-screen', () => {
    mainWindow.webContents.send('fullscreen-status', true)
  })

  mainWindow.on('leave-full-screen', () => {
    mainWindow.webContents.send('fullscreen-status', false)
  })

  ipcMain.on('toggle-fullscreen', (_, isFullscreen: boolean) => {
    mainWindow.setFullScreen(isFullscreen)
  })

  ipcMain.handle('is-fullscreen', () => {
    return mainWindow.isFullScreen()
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    mainWindow.loadFile(join(__dirname, '../../index.html'))
  }
}
