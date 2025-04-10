import { isElectron, osName } from 'react-device-detect'

export function isDesktop(): boolean {
  return isElectron
}

export const isLinux = isDesktop() ? osName === 'Linux' : false
export const isMacOS = isDesktop() ? osName === 'Mac OS' : false
export const isWindows = isDesktop() ? osName === 'Windows' : false
