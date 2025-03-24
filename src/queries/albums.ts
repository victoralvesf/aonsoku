import { AlbumListParams } from '@/service/albums'
import { subsonic } from '@/service/subsonic'

const emptyResponse = { albums: [], nextOffset: null, albumsCount: 0 }

export async function getArtistDiscography(artistId: string) {
  const response = await subsonic.artists.getOne(artistId)

  if (!response || !response.album) return emptyResponse

  return {
    albums: response.album,
    nextOffset: null,
    albumsCount: response.album.length,
  }
}

interface AlbumSearch {
  query: string
  count: number
  offset: number
}

export async function albumSearch({ query, count, offset }: AlbumSearch) {
  const response = await subsonic.search.get({
    query,
    songCount: 0,
    artistCount: 0,
    albumCount: count,
    albumOffset: offset,
  })

  if (!response) return emptyResponse
  if (!response.album) return emptyResponse

  let nextOffset = null
  if (response.album.length >= count) {
    nextOffset = offset + count
  }

  return {
    albums: response.album,
    nextOffset,
    albumsCount: offset + response.album.length,
  }
}

export async function getAlbumList(params: Required<AlbumListParams>) {
  const response = await subsonic.albums.getAlbumList(params)

  if (!response) return emptyResponse
  if (!response.list) return emptyResponse

  let nextOffset = null
  if (response.list.length >= params.size) {
    nextOffset = params.offset + params.size
  }

  return {
    albums: response.list,
    nextOffset,
    albumsCount: response.albumsCount || 0,
  }
}
