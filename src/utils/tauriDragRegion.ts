import { isLinux } from './osType'
import { isTauri } from './tauriTools'

function setDataTauriDragRegion() {
  if (!isTauri() || isLinux) return {}

  return { 'data-tauri-drag-region': true }
}

export const tauriDragRegion = setDataTauriDragRegion()
