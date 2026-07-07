import { del, get, update } from 'idb-keyval'
import { PlayEvent } from '@/types/activity'

const PLAY_EVENTS_KEY = 'play-events'

// Keep the local history bounded so IndexedDB never grows without limit.
const MAX_EVENTS = 50000

export async function recordPlayEvent(event: PlayEvent) {
  try {
    await update<PlayEvent[]>(PLAY_EVENTS_KEY, (events) => {
      const next = events ? [...events, event] : [event]

      return next.length > MAX_EVENTS
        ? next.slice(next.length - MAX_EVENTS)
        : next
    })
  } catch {
    // Persistence is best-effort; never break playback because of it.
  }
}

export async function getPlayEvents(): Promise<PlayEvent[]> {
  const events = await get<PlayEvent[]>(PLAY_EVENTS_KEY)

  return events ?? []
}

export async function clearPlayEvents() {
  await del(PLAY_EVENTS_KEY)
}
