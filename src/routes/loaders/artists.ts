import { LoaderFunctionArgs, defer } from 'react-router-dom'
import { subsonic } from '@/service/subsonic'

export async function artistsListLoader() {
  const allArtistsPromise = subsonic.artists.getAll()

  return defer({
    allArtistsPromise,
  })
}

export async function singleArtistLoader({ params }: LoaderFunctionArgs) {
  const { artistId } = params

  if (artistId) {
    const artist = await subsonic.artists.getOne(artistId)
    const artistInfoPromise = subsonic.artists.getInfo(artistId)
    const topSongsPromise = subsonic.songs.getTopSongs(artist?.name || '')

    return defer({
      artist,
      artistInfo: artistInfoPromise,
      topSongs: topSongsPromise,
    })
  }
}
