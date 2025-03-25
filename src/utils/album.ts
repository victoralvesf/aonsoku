import { Albums } from '@/types/responses/album'

export function sortRecentAlbums(list: Albums[]) {
  return list.sort((a, b) => {
    // if the album does not have a year, send to the end of list
    const yearA = a.year ?? -Infinity
    const yearB = b.year ?? -Infinity

    return yearB - yearA
  })
}
