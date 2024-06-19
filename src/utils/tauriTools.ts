export function isTauri(): boolean {
  return (
    typeof window !== 'undefined' && typeof window.__TAURI__ !== 'undefined'
  )
}
