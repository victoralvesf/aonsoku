import { app, Menu, Tray } from 'electron'
import { mainWindow } from './app'
import { appIcon } from './core/icon'

export let tray: Tray | null = null

export function createTray() {
  tray = new Tray(appIcon())

  tray.setToolTip('Aonsoku')
  updateTray()

  tray.on('click', () => {
    if (!mainWindow) return

    if (mainWindow.isVisible()) {
      mainWindow.hide()
    } else {
      mainWindow.show()
    }

    updateTray()
  })
}

export function updateTray(title?: string) {
  if (!mainWindow || !tray) return

  const isVisible = mainWindow.isVisible()

  const contextMenu = Menu.buildFromTemplate([
    {
      label: title ?? mainWindow.title,
      type: 'normal',
      enabled: false,
    },
    {
      type: 'separator',
    },
    {
      label: isVisible ? 'Hide' : 'Show',
      click: () => {
        if (!mainWindow) return

        if (isVisible) {
          mainWindow.hide()
        } else {
          mainWindow?.show()
        }

        updateTray()
      },
    },
    {
      label: 'Quit',
      click: () => {
        app.quit()
        tray?.destroy()
        mainWindow?.destroy()
      },
    },
  ])

  tray.setToolTip(title ?? mainWindow.title)
  tray.setContextMenu(contextMenu)
}
