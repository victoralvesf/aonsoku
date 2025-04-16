import { IpcChannels, PlayerStateListenerActions } from '../../preload/types'
import { mainWindow } from '../app'

export function sendPlayerEvents(event: PlayerStateListenerActions) {
  if (!mainWindow) return

  mainWindow.webContents.send(IpcChannels.PlayerStateListener, event)
}
