import { is, platform } from '@electron-toolkit/utils'
import {
  app,
  Menu,
  MenuItem,
  MenuItemConstructorOptions,
  shell,
} from 'electron'
import { repository } from '../../../package.json'
import { IpcChannels, ZoomAction } from '../../preload/types'
import { mainWindow } from '../window'
import { aboutDialog } from './about'

function sendZoomAction(action: ZoomAction) {
  if (!mainWindow) return

  mainWindow.webContents.send(IpcChannels.ZoomAction, action)
}

// The native zoom roles are replaced by these items, so the zoom level is
// handled by the renderer and kept in sync with the app settings.
// See src/utils/zoom.ts
const zoomMenuItems: MenuItemConstructorOptions[] = [
  {
    label: 'Actual Size',
    accelerator: 'CmdOrCtrl+0',
    click: () => sendZoomAction('reset'),
  },
  {
    label: 'Zoom In',
    accelerator: 'CmdOrCtrl+Plus',
    click: () => sendZoomAction('in'),
  },
  {
    label: 'Zoom Out',
    accelerator: 'CmdOrCtrl+-',
    click: () => sendZoomAction('out'),
  },
]

const toggleDevTools = {
  role: 'toggleDevTools',
} as const

const toggleFullscreen = [
  { type: 'separator' },
  { role: 'togglefullscreen' },
] as const

const viewMenu: MenuItemConstructorOptions = {
  label: 'View',
  submenu: [
    { role: 'reload' },
    ...(is.dev ? [toggleDevTools] : []),
    { type: 'separator' },
    ...zoomMenuItems,
    ...toggleFullscreen,
  ],
}

const helpMenu: MenuItemConstructorOptions = {
  role: 'help',
  submenu: [
    {
      label: 'Github',
      click: async () => {
        await shell.openExternal(repository.url)
      },
    },
  ],
}

function macTemplate(): (MenuItemConstructorOptions | MenuItem)[] {
  return [
    {
      label: app.name,
      submenu: [
        {
          label: `About ${app.name}`,
          click: () => aboutDialog(),
        },
        { type: 'separator' },
        { role: 'services' },
        { type: 'separator' },
        { role: 'hide' },
        { role: 'hideOthers' },
        { role: 'unhide' },
        { type: 'separator' },
        { role: 'quit' },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        { role: 'selectAll' },
        { type: 'separator' },
        {
          label: 'Speech',
          submenu: [{ role: 'startSpeaking' }, { role: 'stopSpeaking' }],
        },
      ],
    },
    viewMenu,
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'zoom' },
        { type: 'separator' },
        { role: 'front' },
        { type: 'separator' },
        { role: 'window' },
      ],
    },
    helpMenu,
  ]
}

// Windows and Linux don't show a menu bar, but the menu is still registered
// to replace the default one from Electron, which zooms without telling
// the renderer about it.
function defaultTemplate(): (MenuItemConstructorOptions | MenuItem)[] {
  return [
    {
      label: 'File',
      submenu: [{ role: 'quit' }],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'delete' },
        { role: 'selectAll' },
      ],
    },
    viewMenu,
    {
      label: 'Window',
      submenu: [{ role: 'minimize' }, { role: 'close' }],
    },
    helpMenu,
  ]
}

export function createAppMenu() {
  const template = platform.isMacOS ? macTemplate() : defaultTemplate()

  const menu = Menu.buildFromTemplate(template)

  Menu.setApplicationMenu(menu)
}
