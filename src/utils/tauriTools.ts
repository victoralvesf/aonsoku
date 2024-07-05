declare global {
  interface Window {
    __TAURI__: Record<string, unknown>
  }
}

export function isTauri(): boolean {
  return (
    typeof window !== 'undefined' && typeof window.__TAURI__ !== 'undefined'
  )
}
