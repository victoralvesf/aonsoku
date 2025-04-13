import { is } from '@electron-toolkit/utils'
import { app, BrowserWindow, nativeImage, nativeTheme } from 'electron'
import { join } from 'path'

export const resourcesPath = is.dev ? app.getAppPath() : process.resourcesPath
const taskbarIconsPath = join(resourcesPath, 'resources', 'taskbar')

const buttons = {
  previous: 'skip_previous.png',
  pause: 'pause.png',
  play: 'play.png',
  next: 'skip_next.png',
}

export function setTaskbarButtons(window: BrowserWindow) {
  if (!window) return

  window.setThumbarButtons([
    {
      icon: getTaskbarIcon(buttons.previous),
      click() {
        console.log('skip previous clicked.')
      },
    },
    {
      icon: getTaskbarIcon(buttons.play),
      click() {
        console.log('play clicked')
      },
    },
    {
      icon: getTaskbarIcon(buttons.next),
      click() {
        console.log('skip next clicked.')
      },
    },
  ])
}

function getTaskbarIcon(icon: string) {
  const themeFolder = nativeTheme.shouldUseDarkColors ? 'dark' : 'light'

  return nativeImage.createFromPath(join(taskbarIconsPath, themeFolder, icon))
}
