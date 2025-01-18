import { type } from '@tauri-apps/plugin-os'
import { isSafari as isSafariBrowser } from 'react-device-detect'
import { isTauri } from './tauriTools'

export function getOsType() {
  return Promise.resolve(type())
}

export const isWindows = isTauri() ? type() === 'windows' : false
export const isMac = isTauri() ? type() === 'macos' : false
export const isLinux = isTauri() ? type() === 'linux' : false

export const isSafari = isMac || isSafariBrowser
