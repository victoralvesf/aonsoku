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
