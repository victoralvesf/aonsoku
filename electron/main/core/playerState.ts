import { AonsokuStore } from './store'

const schema = {
  isPlaying: { type: 'boolean' },
  hasSonglist: { type: 'boolean' },
  hasPrevious: { type: 'boolean' },
  hasNext: { type: 'boolean' },
}

export const playerStore = new AonsokuStore({
  name: 'player',
  schema,
})

function getIsPlaying() {
  return playerStore.get('isPlaying') as boolean
}
function setIsPlaying(status: boolean) {
  playerStore.set('isPlaying', status)
}

function getHasSonglist() {
  return playerStore.get('hasSonglist') as boolean
}
function setHasSonglist(status: boolean) {
  playerStore.set('hasSonglist', status)
}

function getHasPrevious() {
  return playerStore.get('hasPrevious') as boolean
}
function setHasPrevious(status: boolean) {
  playerStore.set('hasPrevious', status)
}

function getHasNext() {
  return playerStore.get('hasNext') as boolean
}
function setHasNext(status: boolean) {
  playerStore.set('hasNext', status)
}

export const playerState = {
  getIsPlaying,
  setIsPlaying,
  getHasPrevious,
  setHasPrevious,
  getHasNext,
  setHasNext,
  getHasSonglist,
  setHasSonglist,
}
