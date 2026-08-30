import { IpcChannels } from '../../preload/types'
import { mainWindow } from '../window'
import {
  setWidgetServerHooks,
  startWidgetServer,
  stopWidgetServer,
} from './widgetServer'
import { widgetState } from './widgetState'
import {
  WIDGET_DEFAULT_PORT,
  type WidgetNowPlayingPayload,
  type WidgetServerStatus,
  type WidgetSettingsPayload,
} from './widgetTypes'

// In-memory mirror of the renderer's persisted widget store. The renderer's
// `persist` middleware is the durable copy — main only needs a fast read-side
// mirror to serve requests, so nothing here goes through electron-store.
let settings: WidgetSettingsPayload = {
  enabled: false,
  port: WIDGET_DEFAULT_PORT,
  profiles: [],
}

let lastStatus: WidgetServerStatus = { status: 'stopped' }

function sendStatus(status: WidgetServerStatus) {
  lastStatus = status

  if (!mainWindow || mainWindow.isDestroyed()) return

  mainWindow.webContents.send(IpcChannels.WidgetServerStatus, status)
}

setWidgetServerHooks({
  resolveProfile: (id) =>
    settings.profiles.find((profile) => profile.id === id),
  onStatusChange: sendStatus,
})

export async function saveWidgetSettings(payload: WidgetSettingsPayload) {
  const previous = settings
  settings = payload

  const shouldRestart =
    previous.enabled !== payload.enabled || previous.port !== payload.port

  if (!shouldRestart) {
    sendStatus(lastStatus)
    return
  }

  if (!payload.enabled) {
    await stopWidgetServer()
    widgetState.reset()
    sendStatus({ status: 'stopped' })
    return
  }

  await startWidgetServer(payload.port)
}

export function updateWidgetNowPlaying(payload: WidgetNowPlayingPayload) {
  if (!settings.enabled) return

  // widgetServer listens on widgetState and fans this out over SSE.
  widgetState.set(payload)
}

export async function shutdownWidgetServer() {
  await stopWidgetServer()
  widgetState.reset()
  lastStatus = { status: 'stopped' }
}
