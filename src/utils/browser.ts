import i18n from '@/i18n'
import { usePlayerStore } from '@/store/player.store'
import { isTauri } from './tauriTools'

export enum MouseButton {
  Left = 0,
  Middle = 1,
  Right = 2,
}

export function isMacOS() {
  const isMac =
    navigator.userAgent.includes('Mac') || navigator.platform.includes('Mac')

  return isMac ?? false
}

export function preventContextMenu() {
  document.addEventListener('contextmenu', (e) => {
    if (
      e.target instanceof HTMLInputElement ||
      e.target instanceof HTMLTextAreaElement ||
      e.target instanceof HTMLSelectElement
    ) {
      return
    }

    e.preventDefault()
  })
}

function isAnyModifierKeyPressed(e: MouseEvent) {
  return e.ctrlKey || e.metaKey || e.shiftKey || e.altKey
}

export function preventNewTabAndScroll() {
  // Prevent new tab on middle click
  document.addEventListener('auxclick', (e) => {
    e.preventDefault()
  })

  // Prevent scroll circle and new tab
  document.addEventListener('mousedown', (e) => {
    if (e.button === MouseButton.Middle || isAnyModifierKeyPressed(e)) {
      e.preventDefault()
    }
  })

  // Prevent new tab if clicking with special key
  document.addEventListener('click', (e) => {
    if (isAnyModifierKeyPressed(e)) {
      e.preventDefault()
    }
  })
}

export function preventReload() {
  document.addEventListener('keydown', (e) => {
    const isF5 = e.key === 'F5'
    const isReloadCmd = (e.ctrlKey || e.metaKey) && e.key === 'r'

    if (!isF5 && !isReloadCmd) return

    e.preventDefault()

    if (isTauri()) return

    const { isPlaying } = usePlayerStore.getState().playerState

    if (isPlaying) {
      const message = i18n.t('warnings.reload')

      const shouldReload = window.confirm(message)
      if (!shouldReload) return
    }

    window.location.reload()
  })
}
