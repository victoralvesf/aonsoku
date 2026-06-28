import { platform } from '@electron-toolkit/utils'
import { app, Menu } from 'electron'
import { getMacOsMediaIcon } from './macMedia'
import { sendPlayerEvents } from './playerEvents'
import { playerState } from './playerState'

export function updateDockMenu() {
  if (!platform.isMacOS || !app.dock) return

  const { isPlaying, hasPrevious, hasNext, hasSonglist } = playerState.value()

  const dockMenu = Menu.buildFromTemplate([
    {
      label: isPlaying ? 'Pause' : 'Play',
      enabled: hasSonglist,
      icon: getMacOsMediaIcon(isPlaying ? 'pause' : 'play'),
      click: () => sendPlayerEvents('togglePlayPause'),
    },
    { type: 'separator' },
    {
      label: 'Next',
      enabled: hasNext,
      icon: getMacOsMediaIcon('next'),
      click: () => sendPlayerEvents('skipForward'),
    },
    {
      label: 'Previous',
      enabled: hasPrevious,
      icon: getMacOsMediaIcon('previous'),
      click: () => sendPlayerEvents('skipBackwards'),
    },
    { type: 'separator' },
  ])

  app.dock.setMenu(dockMenu)
}
