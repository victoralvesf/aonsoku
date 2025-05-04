import { platform } from '@electron-toolkit/utils'
import { app, Menu, NativeImage, nativeImage, screen, Tray } from 'electron'
import { readFileSync } from 'fs'
import { join } from 'path'
import { mainWindow } from './app'
import { sendPlayerEvents } from './core/playerEvents'
import { playerState } from './core/playerState'
import { resourcesPath } from './core/taskbar'
import { productName } from '../../package.json'

const traySpacer = Array.from({ length: 30 }).join(' ')

export let tray: Tray | null = null

const Variant = {
  Size16: { size: 16, scaleFactor: 1 },
  Size32: { size: 32, scaleFactor: 2 },
  Size48: { size: 48, scaleFactor: 3 },
  Size256: { size: 256, scaleFactor: 16 },
} as const

const Variants = Object.values(Variant)

function getDisplaysMaxScaleFactor(): number {
  const displays = screen.getAllDisplays()
  const scaleFactors = displays
    .map((display) => display.scaleFactor)
    .filter((scaleFactor) => Number.isFinite(scaleFactor) && scaleFactor > 1.0)
  return Math.max(1.0, ...scaleFactors)
}

function getVariantForScaleFactor(scaleFactor: number) {
  const match = Variants.find((variant) => {
    return variant.scaleFactor >= scaleFactor
  })

  return match ?? Variant.Size32
}

function getTrayIconPath(size: number): string {
  let dirName = 'other'
  const fileName = `icon-${size}x${size}.png`

  if (platform.isMacOS) dirName = 'mac'

  return join(resourcesPath, 'assets', 'tray', dirName, fileName)
}

function getTrayIcon(): NativeImage {
  let image: NativeImage

  if (platform.isLinux) {
    // Linux: Static tray icons
    // Use a single tray icon for Linux, as it does not support scale factors.
    // We choose the best icon based on the highest display scale factor.
    const scaleFactor = getDisplaysMaxScaleFactor()
    const variant = getVariantForScaleFactor(scaleFactor)
    const iconPath = getTrayIconPath(variant.size)
    const buffer = readFileSync(iconPath)

    image = nativeImage.createFromBuffer(buffer, {
      scaleFactor: 1.0,
      width: variant.size,
      height: variant.size,
    })
  } else {
    // Windows/macOS: Responsive tray icons
    image = nativeImage.createEmpty()

    for (const variant of Variants) {
      const iconPath = getTrayIconPath(variant.size)
      const buffer = readFileSync(iconPath)
      image.addRepresentation({
        buffer,
        width: variant.size,
        height: variant.size,
        scaleFactor: variant.scaleFactor,
      })
    }

    // Set image as a Template Image for macOS.
    if (platform.isMacOS) image.setTemplateImage(true)
  }

  return image
}

export function createTray() {
  const trayIcon = getTrayIcon()
  tray = new Tray(trayIcon)

  if (!platform.isMacOS) {
    tray.setToolTip(productName)
  }

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
      label: productName + traySpacer,
      ...(trayTooltip !== productName ? { sublabel: trayTooltip } : {}),
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
      label: 'Quit',
      click: () => {
        tray?.destroy()
        mainWindow?.destroy()
        app.quit()
      },
    },
  ])

  if (!platform.isMacOS) {
    tray.setToolTip(trayTooltip)
  }
  tray.setContextMenu(contextMenu)
}
