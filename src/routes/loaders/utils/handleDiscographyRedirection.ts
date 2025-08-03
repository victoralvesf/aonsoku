import { redirect } from 'react-router-dom'
import { ROUTES } from '@/routes/routesList'
import {
  AlbumsFilters,
  AlbumsSearchParams,
  PersistedAlbumListKeys,
} from '@/utils/albumsFilter'
import { SearchParamsHandler } from '@/utils/searchParamsHandler'

export function handleDiscographyRedirection(searchParams: URLSearchParams) {
  const { getSearchParam } = new SearchParamsHandler(searchParams)

  const hasMainFilter = searchParams.has(AlbumsSearchParams.MainFilter)
  const hasArtistNameFilter = searchParams.has(AlbumsSearchParams.ArtistName)
  const hasArtistIdFilter = searchParams.has(AlbumsSearchParams.ArtistId)

  const savedArtistName = localStorage.getItem(
    PersistedAlbumListKeys.ArtistNameFilter,
  )
  const savedArtistId = localStorage.getItem(
    PersistedAlbumListKeys.ArtistIdFilter,
  )
  const savedFilter = localStorage.getItem(PersistedAlbumListKeys.MainFilter)

  const isDiscography = savedFilter === AlbumsFilters.ByDiscography
  const hasPersistedValues = savedArtistName && savedArtistId
  const hasArtistFilter = hasArtistNameFilter && hasArtistIdFilter

  if (
    hasPersistedValues &&
    !hasArtistFilter &&
    !hasMainFilter &&
    isDiscography
  ) {
    return redirect(ROUTES.ALBUMS.ARTIST(savedArtistId, savedArtistName))
  }

  if (hasArtistFilter) {
    const artistName = getSearchParam<string>(AlbumsSearchParams.ArtistName, '')
    const artistId = getSearchParam<string>(AlbumsSearchParams.ArtistId, '')

    localStorage.setItem(
      PersistedAlbumListKeys.MainFilter,
      AlbumsFilters.ByDiscography,
    )
    localStorage.setItem(PersistedAlbumListKeys.ArtistNameFilter, artistName)
    localStorage.setItem(PersistedAlbumListKeys.ArtistIdFilter, artistId)
  }

  return null
}
