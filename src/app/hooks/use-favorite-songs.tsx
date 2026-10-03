import { useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import { getFavoriteSongs } from '@/queries/songs'
import { ISong } from '@/types/responses/song'
import { queryKeys } from '@/utils/queryKeys'

export function useFavoriteSongs() {
  return useQuery({
    queryKey: [queryKeys.favorites.songs],
    queryFn: getFavoriteSongs,
  })
}

const EMPTY_SONGS: ISong[] = []

export function useFavoriteSongsByArtist(
  artistId?: string,
  artistName?: string,
) {
  const query = useFavoriteSongs()
  const songs = query.data?.songs ?? EMPTY_SONGS

  const indexByArtistId = useMemo(() => buildArtistIdIndex(songs), [songs])

  const filtered = useMemo(
    () => lookupSongsByArtist(songs, indexByArtistId, artistId, artistName),
    [songs, indexByArtistId, artistId, artistName],
  )

  return {
    data: query.data ? filtered : undefined,
    isFetching: query.isFetching,
    isFetched: query.isFetched,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
  }
}

export function buildArtistIdIndex(songs: ISong[]): Map<string, ISong[]> {
  const map = new Map<string, ISong[]>()
  for (const song of songs) {
    if (!song.artistId) continue
    let bucket = map.get(song.artistId)
    if (!bucket) {
      bucket = []
      map.set(song.artistId, bucket)
    }
    bucket.push(song)
  }
  return map
}

function normalizeName(name?: string) {
  return name?.toLowerCase().trim() ?? ''
}

export function lookupSongsByArtist(
  songs: ISong[],
  indexByArtistId: Map<string, ISong[]>,
  artistId?: string,
  artistName?: string,
): ISong[] {
  const wanted = normalizeName(artistName)

  if (!artistId && !wanted) return songs

  if (artistId && !wanted) return indexByArtistId.get(artistId) ?? []

  if (!artistId) {
    return songs.filter((s) => normalizeName(s.artist) === wanted)
  }

  return songs.filter((s) =>
    s.artistId ? s.artistId === artistId : normalizeName(s.artist) === wanted,
  )
}
