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
import { SearchParamsHandler } from '@/utils/searchParamsHandler'

export function AlbumsMainFilter() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { getSearchParam } = new SearchParamsHandler(searchParams)

  const currentFilter = getSearchParam<AlbumListType>(
    AlbumsSearchParams.MainFilter,
    AlbumsFilters.RecentlyAdded,
  )
  const artistName = getSearchParam<string>(AlbumsSearchParams.ArtistName, '')

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
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <ListFilter className="w-4 h-4 mr-2" />
          {!artistName ? t(currentFilterLabel) : artistName}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {albumsFilterValues.map((item, index) => {
          return (
            <DropdownMenuCheckboxItem
              key={index}
              checked={!artistName ? item.key === currentFilter : false}
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
