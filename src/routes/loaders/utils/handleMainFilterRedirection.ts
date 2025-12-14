import { redirect } from 'react-router-dom'
import { ROUTES } from '@/routes/routesList'
import { AlbumListType } from '@/types/responses/album'
import {
  AlbumsSearchParams,
  PersistedAlbumListKeys,
} from '@/utils/albumsFilter'

export function handleMainFilterRedirection(searchParams: URLSearchParams) {
  const savedFilter = localStorage.getItem(
    PersistedAlbumListKeys.MainFilter,
  ) as AlbumListType | null

  const hasMainFilter = searchParams.has(AlbumsSearchParams.MainFilter)

  if (savedFilter && !hasMainFilter) {
    return redirect(ROUTES.ALBUMS.GENERIC(savedFilter))
  }

  return null
}
