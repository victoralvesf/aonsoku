import { subsonic } from "@/service/subsonic";
import { LoaderFunctionArgs, defer } from 'react-router-dom'

export async function albumsListLoader() {
  return await subsonic.albums.getAlbumList({ type: 'newest', size: 32 })
}

export async function singleAlbumLoader({ params }: LoaderFunctionArgs<any>) {
  if (params.albumId) {
    const album = await subsonic.albums.getOne(params.albumId)
    const albumInfoPromise = subsonic.albums.getInfo(album?.id!)
    const searchAlbumsPromise = subsonic.search.get({
      query: album?.artist!,
      albumCount: 16,
      songCount: 0,
      artistCount: 0
    })

    if (album?.genre) {
      const randomGenreAlbumsPromise = subsonic.albums.getAlbumList({
        type: 'byGenre',
        genre: album?.genre,
        size: 16
      })

      return defer({
        album,
        artistAlbums: searchAlbumsPromise,
        albumInfo: albumInfoPromise,
        randomGenreAlbums: randomGenreAlbumsPromise
      })
    }

    return defer({
      album,
      artistAlbums: searchAlbumsPromise,
      albumInfo: albumInfoPromise,
    })
  }
}