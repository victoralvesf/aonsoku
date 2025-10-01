import { SearchQueryOptions } from '@/service/search'
import { subsonic } from '@/service/subsonic'
import { SongsOrderByOptions, SortOptions } from '@/utils/albumsFilter'
import { ISong } from '@/types/responses/song'

const emptyResponse = { songs: [], nextOffset: null }

type SongSearchParams = Required<
  Pick<SearchQueryOptions, 'query' | 'songCount' | 'songOffset'>
> & {
  orderBy?: SongsOrderByOptions
  sort?: SortOptions
}

interface ArtistSongsParams {
  orderBy?: SongsOrderByOptions
  sort?: SortOptions
}

function sortSongs(songs: ISong[], orderBy: SongsOrderByOptions, sort: SortOptions): ISong[] {
  const isAsc = sort === SortOptions.Asc
  
  return songs.sort((a, b) => {
    let comparison = 0
    
    switch (orderBy) {
      case SongsOrderByOptions.LastAdded:
        comparison = new Date(a.created).getTime() - new Date(b.created).getTime()
        break
      case SongsOrderByOptions.Artist:
        comparison = (a.artist || '').localeCompare(b.artist || '')
        break
      case SongsOrderByOptions.Title:
        comparison = (a.title || '').localeCompare(b.title || '')
        break
      case SongsOrderByOptions.Album:
        comparison = (a.album || '').localeCompare(b.album || '')
        break
      default:
        comparison = new Date(a.created).getTime() - new Date(b.created).getTime()
    }
    
    return isAsc ? comparison : -comparison
  })
}

// Cache for all songs to avoid refetching
let allSongsCache: { songs: any[], timestamp: number } | null = null
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

async function getAllSongs(orderBy = SongsOrderByOptions.LastAdded, sort = SortOptions.Desc) {
  // Check cache first
  const now = Date.now()
  if (allSongsCache && allSongsCache.timestamp && (now - allSongsCache.timestamp) < CACHE_DURATION) {
    // Re-sort cached songs if sorting changed
    return sortSongs(allSongsCache.songs, orderBy, sort)
  }

  // Fetch all songs by using a very large count
  // For search queries, we need to fetch with empty query to get all songs
  const response = await subsonic.search.get({
    query: '',
    artistCount: 0,
    albumCount: 0,
    songCount: 999999,
    songOffset: 0,
  })

  if (!response || !response.song) return []

  // Update cache with unsorted songs
  allSongsCache = {
    songs: response.song,
    timestamp: now
  }

  // Return sorted songs
  return sortSongs(response.song, orderBy, sort)
}

export async function songsSearch(params: SongSearchParams) {
  const orderBy = params.orderBy || SongsOrderByOptions.LastAdded
  const sort = params.sort || SortOptions.Desc
  
  // If there's a search query, use the original search behavior
  if (params.query && params.query.trim() !== '') {
    const response = await subsonic.search.get({
      artistCount: 0,
      albumCount: 0,
      query: params.query,
      songCount: params.songCount,
      songOffset: params.songOffset,
    })

    if (!response) return emptyResponse
    if (!response.song) return emptyResponse

    // For search results, sort by the selected criteria
    const sortedSongs = sortSongs(response.song, orderBy, sort)

    let nextOffset = null
    if (sortedSongs.length >= params.songCount) {
      nextOffset = params.songOffset + params.songCount
    }

    return {
      songs: sortedSongs,
      nextOffset,
    }
  }

  // For browsing all songs (no search query), fetch all and paginate
  const allSongs = await getAllSongs(orderBy, sort)
  
  if (allSongs.length === 0) return emptyResponse

  // Apply pagination to the sorted results
  const startIndex = params.songOffset
  const endIndex = startIndex + params.songCount
  const paginatedSongs = allSongs.slice(startIndex, endIndex)

  let nextOffset = null
  if (endIndex < allSongs.length) {
    nextOffset = endIndex
  }

  return {
    songs: paginatedSongs,
    nextOffset,
  }
}

export async function getArtistAllSongs(artistId: string, params: ArtistSongsParams = {}) {
  const orderBy = params.orderBy || SongsOrderByOptions.LastAdded
  const sort = params.sort || SortOptions.Desc
  
  const artist = await subsonic.artists.getOne(artistId)

  if (!artist || !artist.album) return emptyResponse

  const results = await Promise.all(
    artist.album.map((a) => subsonic.albums.getOne(a.id)),
  )

  const songs = results.flatMap((result) => {
    if (!result) return []

    return result.song
  })

  // Sort by the selected criteria
  const sortedSongs = sortSongs(songs, orderBy, sort)

  return {
    songs: sortedSongs,
    nextOffset: null,
  }
}
