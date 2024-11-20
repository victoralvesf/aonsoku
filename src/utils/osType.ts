import { type } from '@tauri-apps/plugin-os'
import { isTauri } from './tauriTools'

export function getOsType() {
  return Promise.resolve(type())
}

export const isWindows = isTauri() ? type() === 'windows' : false
export const isMac = isTauri() ? type() === 'macos' : false
export const isLinux = isTauri() ? type() === 'linux' : false
