import { BrowserWindow, nativeImage, nativeTheme } from 'electron'
import { join } from 'path'
import { cwd } from 'process'

const resourcesPath = join(cwd(), 'resources', 'taskbar')

export function setTaskbarButtons(window: BrowserWindow) {
  if (!window) return

  const themeFolder = nativeTheme.shouldUseDarkColors ? 'dark' : 'light'

  window.setThumbarButtons([
    {
      icon: nativeImage.createFromPath(
        join(resourcesPath, themeFolder, '/skip_previous.png'),
      ),
      click() {
        console.log('skip previous clicked.')
      },
    },
    {
      icon: nativeImage.createFromPath(
        join(resourcesPath, themeFolder, '/play.png'),
      ),
      click() {
        console.log('play clicked')
      },
    },
    {
      icon: nativeImage.createFromPath(
        join(resourcesPath, themeFolder, '/skip_next.png'),
      ),
      click() {
        console.log('skip next clicked.')
      },
    },
  ])
}
