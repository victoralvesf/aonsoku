import { SearchQueryOptions } from '@/service/search'
import { subsonic } from '@/service/subsonic'

const emptyResponse = { songs: [], nextOffset: null }

type SongSearchParams = Required<
  Pick<SearchQueryOptions, 'query' | 'songCount' | 'songOffset'>
>

export async function songsSearch(params: SongSearchParams) {
  const response = await subsonic.search.get({
    artistCount: 0,
    albumCount: 0,
    ...params,
  })

  if (!response) return emptyResponse
  if (!response.song) return emptyResponse

  let nextOffset = null
  if (response.song.length >= params.songCount) {
    nextOffset = params.songOffset + params.songCount
  }

  return {
    songs: response.song,
    nextOffset,
  }
}

export async function getArtistAllSongs(artistId: string) {
  const artist = await subsonic.artists.getOne(artistId)

  if (!artist || !artist.album) return emptyResponse

  const results = await Promise.all(
    artist.album.map((a) => subsonic.albums.getOne(a.id)),
  )

  const songs = results.flatMap((result) => {
    if (!result) return []

    return result.song
  })

  return {
    songs,
    nextOffset: null,
  }
}
