import type { ZoomAction } from '../../electron/preload/types'
import { isDesktop } from './desktop'

export const zoomLevels = [50, 67, 75, 80, 90, 100, 110, 125, 150, 175, 200]

export const defaultZoomLevel = 100

export function closestZoomLevel(value: number) {
  return zoomLevels.reduce((closest, level) =>
    Math.abs(level - value) < Math.abs(closest - value) ? level : closest,
  )
}

export function nextZoomLevel(current: number, action: ZoomAction) {
  if (action === 'reset') return defaultZoomLevel

  const index = zoomLevels.indexOf(closestZoomLevel(current))
  const next = action === 'in' ? index + 1 : index - 1

  return zoomLevels[Math.min(Math.max(next, 0), zoomLevels.length - 1)]
}

export function zoomScale(level: number) {
  return closestZoomLevel(level) / 100
}

// CSS zoom scales the page but not the viewport, so `100vh` and `100vw` would
// keep returning the unscaled window size and break the app layout.
// These vars hold the window size in the scaled coordinate space and are used
// by the `screen` spacing (h-screen, w-screen) and by the content height vars.
function updateAppSizeVars(scale: number) {
  const root = document.documentElement

  root.style.setProperty('--app-height', `${window.innerHeight / scale}px`)
  root.style.setProperty('--app-width', `${window.innerWidth / scale}px`)
}

let currentScale = 1
let isResizeListenerAttached = false

function attachResizeListener() {
  if (isResizeListenerAttached) return
  isResizeListenerAttached = true

  window.addEventListener('resize', () => updateAppSizeVars(currentScale))
}

export function applyZoomLevel(level: number) {
  currentScale = zoomScale(level)

  // The desktop app uses Chromium's own zoom, which resizes the layout
  // viewport, so no CSS is needed there.
  if (isDesktop()) {
    window.api.setZoomFactor(currentScale)
    return
  }

  document.documentElement.style.setProperty('--app-zoom', `${currentScale}`)
  updateAppSizeVars(currentScale)
  attachResizeListener()
}
