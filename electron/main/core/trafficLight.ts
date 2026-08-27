import { platform } from '@electron-toolkit/utils'
import { BrowserWindow } from 'electron'

// The traffic lights are drawn by macOS and don't scale with the app zoom, but
// the header they sit on does, so they need to be vertically repositioned
// whenever the zoom factor changes to stay centered on it. The horizontal
// offset is kept fixed so the space the app reserves for them in the header
// stays the same at any zoom level.
// See src/utils/zoom.ts and the --header-height var in src/index.css
const HEADER_HEIGHT = 44
const BUTTONS_HEIGHT = 16
const HORIZONTAL_OFFSET = 15

export function trafficLightPosition(zoomFactor: number): Electron.Point {
  return {
    x: HORIZONTAL_OFFSET,
    y: Math.round((HEADER_HEIGHT * zoomFactor - BUTTONS_HEIGHT) / 2),
  }
}

export const defaultTrafficLightPosition = trafficLightPosition(1)

export function setTrafficLightPosition(
  window: BrowserWindow | null,
  zoomFactor: number,
) {
  if (!platform.isMacOS) return
  if (!window || window.isDestroyed()) return

  window.setWindowButtonPosition(trafficLightPosition(zoomFactor))
}
