import { redirect } from 'react-router-dom'
import { ROUTES } from '@/routes/routesList'
import { AlbumListType } from '@/types/responses/album'
import {
  AlbumsFilters,
  AlbumsSearchParams,
  PersistedAlbumListKeys,
} from '@/utils/albumsFilter'
import { SearchParamsHandler } from '@/utils/searchParamsHandler'

export function handleGenreFilterRedirection(searchParams: URLSearchParams) {
  const { getSearchParam } = new SearchParamsHandler(searchParams)

  const savedGenre = localStorage.getItem(PersistedAlbumListKeys.GenreFilter)
  const persistedMainFilter = localStorage.getItem(
    PersistedAlbumListKeys.MainFilter,
  ) as AlbumListType | null

  const isByGenreFilter = persistedMainFilter === AlbumsFilters.ByGenre

  const hasMainFilter = searchParams.has(AlbumsSearchParams.MainFilter)
  const hasGenreFilter = searchParams.has(AlbumsSearchParams.Genre)

  if (savedGenre && !hasMainFilter && !hasGenreFilter && isByGenreFilter) {
    return redirect(ROUTES.ALBUMS.GENRE(savedGenre))
  }

  if (hasGenreFilter) {
    const genre = getSearchParam<string>(AlbumsSearchParams.Genre, '')

    localStorage.setItem(PersistedAlbumListKeys.GenreFilter, genre)
  }

  return null
}
