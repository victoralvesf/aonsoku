import { isElectron, osName } from 'react-device-detect'

function isCypress(): boolean {
  return (window as { Cypress?: unknown }).Cypress !== undefined
}

function checkKDE(): boolean {
  if (!window.envVars.XDG_CURRENT_DESKTOP) return false

  return window.envVars.XDG_CURRENT_DESKTOP.split(':').some(
    (desktop: string) => desktop === 'KDE',
  )
}

export function isDesktop(): boolean {
  return isElectron && !isCypress()
}

export const isDeviceLinux = osName === 'Linux'
export const isDeviceMacOS = osName === 'Mac OS'
export const isDeviceWindows = osName === 'Windows'

export const isLinux = isDesktop() ? isDeviceLinux : false
export const isMacOS = isDesktop() ? isDeviceMacOS : false
export const isWindows = isDesktop() ? isDeviceWindows : false

export const isKDE = isLinux ? checkKDE() : false
