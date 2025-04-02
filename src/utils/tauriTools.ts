import { emit } from '@tauri-apps/api/event'
import { logger } from './logger'

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

export async function emitBgChange(color: string) {
  if (!isTauri()) return

  try {
    await emit('aonsoku_theme_changed', color)
    logger.info('[emitBgChanged] - Theme changed event emitted. Color:', color)
  } catch (error) {
    logger.error('[emitBgChanged] - Failed to emit theme changed event.', error)
  }
}
