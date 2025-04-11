import { is } from '@electron-toolkit/utils'
import { shell, BrowserWindow, nativeImage, nativeTheme } from 'electron'
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
    backgroundColor: '#121212',
    minWidth: 1280,
    minHeight: 720,
    show: false,
    autoHideMenuBar: true,
    titleBarStyle: 'hidden',
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

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env.ELECTRON_RENDERER_URL) {
    mainWindow.loadURL(process.env.ELECTRON_RENDERER_URL)
  } else {
    mainWindow.loadFile(join(__dirname, '../../index.html'))
  }
}
