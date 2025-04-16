import { app, Menu, Tray } from 'electron'
import { mainWindow } from './app'
import { appIcon } from './core/icon'
import { sendPlayerEvents } from './core/playerEvents'
import { playerState } from './core/playerState'
import { config } from '../../package.json'

const traySpacer = Array.from({ length: 30 }).join(' ')

export let tray: Tray | null = null

export function createTray() {
  tray = new Tray(appIcon())

  tray.setToolTip(config.productName)
  updateTray()

  tray.on('click', () => {
    tray?.popUpContextMenu()
  })
}

export function updateTray(title?: string) {
  if (!mainWindow || !tray) return

  const isVisible = mainWindow.isVisible()
  const trayTooltip = title ?? mainWindow.title

  const { getIsPlaying, getHasPrevious, getHasNext, getHasSonglist } =
    playerState

  const contextMenu = Menu.buildFromTemplate([
    {
      label: config.productName + traySpacer,
      ...(trayTooltip !== config.productName ? { sublabel: trayTooltip } : {}),
      type: 'normal',
      enabled: false,
    },
    {
      type: 'separator',
    },
    {
      label: 'Previous',
      type: 'normal',
      enabled: getHasPrevious(),
      click: () => {
        sendPlayerEvents('skipBackwards')
      },
    },
    {
      label: getIsPlaying() ? 'Pause' : 'Play',
      type: 'normal',
      enabled: getHasSonglist(),
      click: () => {
        sendPlayerEvents('togglePlayPause')
      },
    },
    {
      label: 'Next',
      type: 'normal',
      enabled: getHasNext(),
      click: () => {
        sendPlayerEvents('skipForward')
      },
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
      label: 'About',
      role: 'about',
    },
    {
      label: 'Quit',
      role: 'quit',
      click: () => {
        app.quit()
        tray?.destroy()
        mainWindow?.destroy()
      },
    },
  ])

  tray.setToolTip(trayTooltip)
  tray.setTitle(config.productName)
  tray.setContextMenu(contextMenu)
}
