import { IpcChannels, PlayerStateListenerActions } from '../../preload/types'
import { mainWindow } from '../window'

export function sendPlayerEvents(event: PlayerStateListenerActions) {
  if (!mainWindow || mainWindow.isDestroyed()) return

  mainWindow.webContents.send(IpcChannels.PlayerStateListener, event)
}
