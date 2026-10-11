import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ISong } from '@/types/responses/song'
import { usePlayerStore } from './player.store'

vi.mock('./idb', () => ({
  idbStorage: {
    getItem: vi.fn(),
    setItem: vi.fn(),
    removeItem: vi.fn(),
  },
}))

function song(id: string) {
  return { id, title: id } as ISong
}

function ids(list: ISong[]) {
  return list.map((item) => item.id)
}

function getState() {
  return usePlayerStore.getState()
}

describe('setNextOnQueue', () => {
  beforeEach(() => {
    getState().actions.clearPlayerState()
  })

  it('adds new songs right after the current song', () => {
    const list = ['a', 'b', 'c'].map(song)
    getState().actions.setSongList(list, 0)

    getState().actions.setNextOnQueue([song('d')])

    const { currentList, originalList, currentSongIndex } = getState().songlist
    expect(ids(currentList)).toEqual(['a', 'd', 'b', 'c'])
    expect(ids(originalList)).toEqual(['a', 'd', 'b', 'c'])
    expect(currentSongIndex).toBe(0)
  })

  it('moves a song that is later in the queue to play next', () => {
    const list = ['a', 'b', 'c', 'd', 'e'].map(song)
    getState().actions.setSongList(list, 1)

    getState().actions.setNextOnQueue([song('e')])

    const { currentList, originalList, currentSongIndex, currentSong } =
      getState().songlist
    expect(ids(currentList)).toEqual(['a', 'b', 'e', 'c', 'd'])
    expect(ids(originalList)).toEqual(['a', 'b', 'e', 'c', 'd'])
    expect(currentSongIndex).toBe(1)
    expect(currentSong.id).toBe('b')
  })

  it('moves a song that was already played and keeps the current song', () => {
    const list = ['a', 'b', 'c', 'd', 'e'].map(song)
    getState().actions.setSongList(list, 3)

    getState().actions.setNextOnQueue([song('a')])

    const { currentList, originalList, currentSongIndex, currentSong } =
      getState().songlist
    expect(ids(currentList)).toEqual(['b', 'c', 'd', 'a', 'e'])
    expect(ids(originalList)).toEqual(['b', 'c', 'd', 'a', 'e'])
    expect(currentSongIndex).toBe(2)
    expect(currentSong.id).toBe('d')
  })

  it('does not move the song that is currently playing', () => {
    const list = ['a', 'b', 'c'].map(song)
    getState().actions.setSongList(list, 1)

    getState().actions.setNextOnQueue([song('b')])

    const { currentList, currentSongIndex } = getState().songlist
    expect(ids(currentList)).toEqual(['a', 'b', 'c'])
    expect(currentSongIndex).toBe(1)
  })

  it('handles a mix of new and queued songs, keeping their order', () => {
    const list = ['a', 'b', 'c', 'd'].map(song)
    getState().actions.setSongList(list, 2)

    getState().actions.setNextOnQueue(['d', 'x', 'c', 'a'].map(song))

    const { currentList, currentSongIndex, currentSong } = getState().songlist
    expect(ids(currentList)).toEqual(['b', 'c', 'd', 'x', 'a'])
    expect(currentSongIndex).toBe(1)
    expect(currentSong.id).toBe('c')
  })

  it('keeps the original list in sync while shuffle is active', () => {
    const list = ['a', 'b', 'c', 'd', 'e'].map(song)
    getState().actions.setSongList(list, 0)
    getState().actions.toggleShuffle()

    const { currentList: shuffled } = getState().songlist
    const current = shuffled[0].id
    const target = shuffled[shuffled.length - 1].id

    getState().actions.setNextOnQueue([song(target)])

    const { currentList, originalList, currentSongIndex, currentSong } =
      getState().songlist
    expect(currentSongIndex).toBe(0)
    expect(currentSong.id).toBe(current)
    expect(currentList[1].id).toBe(target)
    expect(currentList).toHaveLength(5)

    const originalIds = ids(originalList)
    expect(originalIds).toHaveLength(5)
    expect(originalIds[originalIds.indexOf(current) + 1]).toBe(target)

    getState().actions.toggleShuffle()

    expect(
      getState().songlist.currentList[getState().songlist.currentSongIndex].id,
    ).toBe(current)
    expect(ids(getState().songlist.currentList)).toEqual(originalIds)
  })
})
