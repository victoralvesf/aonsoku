import { ISong } from '@/types/responses/song'

export function areSongListsEqual(list1: ISong[], list2: ISong[]) {
  if (list1.length !== list2.length) {
    return false
  }
  return list1.every((song, index) => song.id === list2[index].id)
}
