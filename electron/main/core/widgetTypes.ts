// Shared between the main process (HTTP server), the preload bridge, the
// renderer settings page and the standalone widget bundle.
// Keep this file free of any electron/node import so every side can use it.

export type WidgetTheme = 'light' | 'dark' | 'transparent'

export type WidgetIdleBehavior = 'hide' | 'show-empty-state'

export interface WidgetProfile {
  id: string
  name: string
  theme: WidgetTheme
  compact: boolean
  showCoverArt: boolean
  showArtist: boolean
  showAlbum: boolean
  showProgressBar: boolean
  idleBehavior: WidgetIdleBehavior
  transitionOnChange: boolean
}

export interface WidgetSettingsPayload {
  enabled: boolean
  port: number
  profiles: WidgetProfile[]
}

export interface WidgetNowPlayingPayload {
  isPlaying: boolean
  title: string
  artist: string
  album?: string
  coverArtUrl?: string
  duration: number
  position: number
  // Date.now() when the snapshot was taken, used by the widget to
  // extrapolate the position between ticks.
  updatedAt: number
}

export type WidgetServerErrorCode = 'port-in-use' | 'invalid-port' | 'unknown'

export type WidgetServerStatus =
  | { status: 'stopped' }
  | { status: 'running'; port: number }
  | {
      status: 'error'
      port: number
      code: WidgetServerErrorCode
      message: string
    }

export const WIDGET_DEFAULT_PORT = 14262
export const WIDGET_MIN_PORT = 10000
export const WIDGET_MAX_PORT = 32767

// Chromium (and therefore the OBS Browser Source) refuses to connect to its
// ERR_UNSAFE_PORT list. 10080 is the only entry inside our allowed range and
// would fail silently with a blank source, so it is rejected up front.
export const WIDGET_BLOCKED_PORTS = [10080]

export const WIDGET_MAX_PROFILES = 5

export const WIDGET_RECOMMENDED_SIZE = {
  full: { width: 420, height: 140 },
  compact: { width: 340, height: 72 },
}

export function isValidWidgetPort(port: number): boolean {
  if (!Number.isInteger(port)) return false
  if (port < WIDGET_MIN_PORT || port > WIDGET_MAX_PORT) return false

  return !WIDGET_BLOCKED_PORTS.includes(port)
}
