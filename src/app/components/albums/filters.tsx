import { useSearchParams } from 'react-router-dom'
import { AlbumListType } from '@/types/responses/album'
import { AlbumsFilters, AlbumsSearchParams } from '@/utils/albumsFilter'
import { SearchParamsHandler } from '@/utils/searchParamsHandler'
import { AlbumsFilterByGenre } from './filters/by-genre'
import { AlbumsFilterByYear } from './filters/by-year'
import { AlbumsMainFilter } from './filters/main'

export function AlbumsFilter() {
  const [searchParams] = useSearchParams()
  const { getSearchParam } = new SearchParamsHandler(searchParams)

  const currentFilter = getSearchParam<AlbumListType>(
    AlbumsSearchParams.MainFilter,
    AlbumsFilters.RecentlyAdded,
  )

  return (
    <div className="flex gap-2">
      {currentFilter === AlbumsFilters.ByYear && <AlbumsFilterByYear />}

      {currentFilter === AlbumsFilters.ByGenre && <AlbumsFilterByGenre />}

      <AlbumsMainFilter />
    </div>
  )
}
