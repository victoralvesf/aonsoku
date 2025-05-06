import { is } from '@electron-toolkit/utils'
import { app, nativeImage, nativeTheme } from 'electron'
import { join } from 'path'
import { sendPlayerEvents } from './playerEvents'
import { playerState } from './playerState'
import { mainWindow } from '../app'

export const resourcesPath = join(
  is.dev ? app.getAppPath() : process.resourcesPath,
  'resources',
)
const taskbarIconsPath = join(resourcesPath, 'taskbar')

const buttons = {
  previous: 'skip_previous.png',
  pause: 'pause.png',
  play: 'play.png',
  next: 'skip_next.png',
}

export function setTaskbarButtons() {
  if (!mainWindow) return
  if (!mainWindow.isVisible()) return

  const { isPlaying, hasPrevious, hasNext, hasSonglist } = playerState.value()

  mainWindow.setThumbarButtons([
    {
      icon: getTaskbarIcon(buttons.previous),
      flags: hasPrevious ? undefined : ['disabled'],
      click() {
        sendPlayerEvents('skipBackwards')
      },
    },
    {
      icon: getTaskbarIcon(isPlaying ? buttons.pause : buttons.play),
      flags: hasSonglist ? undefined : ['disabled'],
      click() {
        sendPlayerEvents('togglePlayPause')
      },
    },
    {
      icon: getTaskbarIcon(buttons.next),
      flags: hasNext ? undefined : ['disabled'],
      click() {
        sendPlayerEvents('skipForward')
      },
    },
  ])
}

function getTaskbarIcon(icon: string) {
  const themeFolder = nativeTheme.shouldUseDarkColors ? 'dark' : 'light'

  return nativeImage.createFromPath(join(taskbarIconsPath, themeFolder, icon))
}
