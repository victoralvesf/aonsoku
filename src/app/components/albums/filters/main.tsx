import { ListFilter } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@/app/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu'
import { AlbumListType } from '@/types/responses/album'
import {
  AlbumsFilters,
  albumsFilterValues,
  AlbumsSearchParams,
} from '@/utils/albumsFilter'
import { scrollPageToTop } from '@/utils/scrollPageToTop'
import { SearchParamsHandler } from '@/utils/searchParamsHandler'

const hiddenFilters = [AlbumsFilters.ByDiscography, AlbumsFilters.Search]

export function AlbumsMainFilter() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { getSearchParam } = new SearchParamsHandler(searchParams)

  const currentFilter = getSearchParam<AlbumListType>(
    AlbumsSearchParams.MainFilter,
    AlbumsFilters.RecentlyAdded,
  )

  const currentFilterLabel = albumsFilterValues.filter(
    (item) => item.key === currentFilter,
  )[0].label

  function handleChangeFilter(filter: AlbumListType) {
    setSearchParams((state) => {
      state.set(AlbumsSearchParams.MainFilter, filter)

      state.delete(AlbumsSearchParams.ArtistId)
      state.delete(AlbumsSearchParams.ArtistName)
      if (filter !== AlbumsFilters.ByYear)
        state.delete(AlbumsSearchParams.YearFilter)
      if (filter !== AlbumsFilters.ByGenre)
        state.delete(AlbumsSearchParams.Genre)

      return state
    })
    scrollPageToTop()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <ListFilter className="w-4 h-4 mr-2" />
          {t(currentFilterLabel)}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {albumsFilterValues.map((item, index) => {
          if (hiddenFilters.includes(item.key)) return null

          return (
            <DropdownMenuCheckboxItem
              key={index}
              checked={item.key === currentFilter}
              onCheckedChange={() =>
                handleChangeFilter(item.key as AlbumListType)
              }
              className="cursor-pointer"
            >
              {t(item.label)}
            </DropdownMenuCheckboxItem>
          )
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
