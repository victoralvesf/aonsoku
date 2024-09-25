import { useQuery } from '@tanstack/react-query'
import {
  ArrowDown,
  ArrowUp,
  Check,
  ChevronsUpDown,
  ListFilter,
} from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@/app/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/app/components/ui/command'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'
import { cn } from '@/lib/utils'
import { subsonic } from '@/service/subsonic'
import { AlbumListType } from '@/types/responses/album'
import {
  AlbumsFilters,
  albumsFilterValues,
  AlbumsSearchParams,
  YearFilter,
  YearSortOptions,
} from '@/utils/albumsFilter'
import { queryKeys } from '@/utils/queryKeys'
import { SearchParamsHandler } from '@/utils/searchParamsHandler'

export function AlbumsFilter() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [genrePopover, setGenrePopover] = useState(false)
  const { getSearchParam } = new SearchParamsHandler(searchParams)

  const { data: genres } = useQuery({
    queryKey: [queryKeys.genre],
    queryFn: subsonic.genres.get,
  })

  const currentFilter = getSearchParam<AlbumListType>(
    AlbumsSearchParams.MainFilter,
    AlbumsFilters.RecentlyAdded,
  )
  const yearFilter = getSearchParam<YearFilter>(
    AlbumsSearchParams.YearFilter,
    YearSortOptions.Oldest,
  )
  const genre = getSearchParam<string>(AlbumsSearchParams.Genre, '')
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

  function handleChangeYearSort() {
    setSearchParams((state) => {
      const filter =
        yearFilter === YearSortOptions.Newest
          ? YearSortOptions.Oldest
          : YearSortOptions.Newest

      state.set(AlbumsSearchParams.YearFilter, filter)

      return state
    })
  }

  function handleChangeGenreFilter(value: string) {
    setSearchParams((state) => {
      state.set(AlbumsSearchParams.Genre, value)

      return state
    })
    setGenrePopover(false)
  }

  function yearFilterTooltip() {
    if (yearFilter === YearSortOptions.Oldest) {
      return t('table.sort.asc')
    } else {
      return t('table.sort.desc')
    }
  }

  return (
    <div className="flex gap-2">
      {currentFilter === AlbumsFilters.ByYear && (
        <SimpleTooltip text={yearFilterTooltip()}>
          <Button variant="outline" size="sm" onClick={handleChangeYearSort}>
            {yearFilter === YearSortOptions.Oldest ? (
              <ArrowUp className="w-4 h-4" />
            ) : (
              <ArrowDown className="w-4 h-4" />
            )}
          </Button>
        </SimpleTooltip>
      )}

      {currentFilter === AlbumsFilters.ByGenre && genres !== undefined && (
        <Popover open={genrePopover} onOpenChange={setGenrePopover}>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              role="combobox"
              aria-expanded={genrePopover}
              className="w-[220px] justify-between"
            >
              {!genre ? t('album.list.genre.label') : genre}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[220px] p-0" align="end">
            <Command>
              <CommandInput placeholder={t('album.list.genre.search')} />
              <CommandList>
                <CommandEmpty>No genre found.</CommandEmpty>
                <CommandGroup>
                  {genres.map(({ value }) => (
                    <CommandItem
                      key={value}
                      value={value}
                      onSelect={(currentValue) =>
                        handleChangeGenreFilter(currentValue)
                      }
                    >
                      <Check
                        className={cn(
                          'mr-2 h-4 w-4',
                          genre === value ? 'opacity-100' : 'opacity-0',
                        )}
                      />
                      {value}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      )}

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
    </div>
  )
}
