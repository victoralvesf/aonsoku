import { WidgetNowPlayingPayload } from './widgetTypes'

// In-memory only, like playerState's runtime data. The now-playing snapshot is
// meaningless across restarts, so it is never persisted.
let snapshot: WidgetNowPlayingPayload | null = null

type Listener = (payload: WidgetNowPlayingPayload) => void

const listeners = new Set<Listener>()

function get(): WidgetNowPlayingPayload | null {
  return snapshot
}

function set(payload: WidgetNowPlayingPayload) {
  snapshot = payload

  listeners.forEach((listener) => {
    try {
      listener(payload)
    } catch {}
  })
}

function reset() {
  snapshot = null
}

function subscribe(listener: Listener) {
  listeners.add(listener)

  return () => {
    listeners.delete(listener)
  }
}

export const widgetState = {
  get,
  set,
  reset,
  subscribe,
}
