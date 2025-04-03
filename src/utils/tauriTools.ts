import { emit } from '@tauri-apps/api/event'
import { logger } from './logger'
import { isMac } from './osType'

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
  if (!isMac) return

  try {
    await emit('aonsoku_theme_changed', color)
    logger.info('[emitBgChanged] - Theme changed event emitted. Color:', color)
  } catch (error) {
    logger.error('[emitBgChanged] - Failed to emit theme changed event.', error)
  }
}
