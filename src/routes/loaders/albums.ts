import { LoaderFunctionArgs, defer } from 'react-router-dom'
import { subsonic } from '@/service/subsonic'

export async function singleAlbumLoader({ params }: LoaderFunctionArgs) {
  if (params.albumId) {
    const album = await subsonic.albums.getOne(params.albumId)
    const albumInfoPromise = subsonic.albums.getInfo(album?.id || '')
    const searchAlbumsPromise = subsonic.search.get({
      query: album?.artist || '',
      albumCount: 16,
      songCount: 0,
      artistCount: 0,
    })

    if (album?.genre) {
      const randomGenreAlbumsPromise = subsonic.albums.getAlbumList({
        type: 'byGenre',
        genre: album?.genre,
        size: 16,
      })

      return defer({
        album,
        artistAlbums: searchAlbumsPromise,
        albumInfo: albumInfoPromise,
        randomGenreAlbums: randomGenreAlbumsPromise,
      })
    }

    return defer({
      album,
      artistAlbums: searchAlbumsPromise,
      albumInfo: albumInfoPromise,
    })
  }
}
