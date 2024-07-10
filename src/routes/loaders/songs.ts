import { defer } from 'react-router-dom'
import { subsonic } from '@/service/subsonic'

export async function songsListLoader() {
  const allSongsPromise = subsonic.search.get({
    query: '',
    albumCount: 0,
    artistCount: 0,
    songCount: 999999999,
    songOffset: 0,
  })

  return defer({
    allSongsPromise,
  })
}
