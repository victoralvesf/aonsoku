import { PlayerStatePayload } from '../../preload/types'
import { AonsokuStore } from './store'

const playerStore = new AonsokuStore<PlayerStatePayload>({
  name: 'player',
  defaults: {
    isPlaying: false,
    hasSonglist: false,
    hasPrevious: false,
    hasNext: false,
  },
})

function get<T extends keyof PlayerStatePayload>(
  key: T,
): PlayerStatePayload[T] {
  return playerStore.get(key)
}

function set<T extends keyof PlayerStatePayload>(
  key: T,
  status: PlayerStatePayload[T],
) {
  playerStore.set(key, status)
}

function setAll(payload: PlayerStatePayload) {
  playerStore.set(payload)
}

export const playerState = {
  get,
  set,
  setAll,
  value: () => playerStore.store,
}
