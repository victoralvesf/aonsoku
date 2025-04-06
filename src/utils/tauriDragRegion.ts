import { isTauri } from './tauriTools'

function setDataTauriDragRegion() {
  if (!isTauri()) return {}

  return { 'data-tauri-drag-region': true }
}

export const tauriDragRegion = setDataTauriDragRegion()
