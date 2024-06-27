import { subsonic } from '@/service/subsonic'
import { sortByString } from '@/utils/sort'

export async function songsListLoader() {
  const response = await subsonic.search.get({
    query: '',
    albumCount: 0,
    artistCount: 0,
    songCount: 999999999,
    songOffset: 0,
  })

  if (!response || !response.song) return null

  const songsSorted = response.song.sort((a, b) =>
    sortByString(a.title, b.title),
  )
  const songsLength = response.song.length

  return {
    count: songsLength,
    songs: songsSorted,
  }
}
