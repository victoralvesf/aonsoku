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
import { albumsPageFilterValues } from '@/utils/albumsPageFilterValues'
import { queryKeys } from '@/utils/queryKeys'
import { SearchParamsHandler } from '@/utils/searchParamsHandler'

export type YearFilter = 'oldest' | 'newest'

export function AlbumsFilter() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const [genrePopover, setGenrePopover] = useState(false)
  const { getSearchParam } = new SearchParamsHandler(searchParams)

  const { data: genres } = useQuery({
    queryKey: [queryKeys.genre],
    queryFn: subsonic.genres.get,
  })

  const currentFilter = getSearchParam<AlbumListType>('filter', 'newest')
  const yearFilter = getSearchParam<YearFilter>('yearFilter', 'oldest')
  const genre = getSearchParam<string>('genre', '')
  const artistName = getSearchParam<string>('artistName', '')

  const currentFilterLabel = albumsPageFilterValues.filter(
    (item) => item.key === currentFilter,
  )[0].label

  function handleChangeFilter(filter: AlbumListType) {
    setSearchParams((state) => {
      state.set('filter', filter)

      state.delete('artistId')
      state.delete('artistName')
      if (filter !== 'byYear') state.delete('yearFilter')
      if (filter !== 'byGenre') state.delete('genre')

      return state
    })
  }

  function handleChangeYearSort() {
    setSearchParams((state) => {
      const filter = yearFilter === 'newest' ? 'oldest' : 'newest'
      state.set('yearFilter', filter)

      return state
    })
  }

  function handleChangeGenreFilter(value: string) {
    setSearchParams((state) => {
      state.set('genre', value)

      return state
    })
    setGenrePopover(false)
  }

  return (
    <div className="flex gap-2">
      {currentFilter === 'byYear' && (
        <SimpleTooltip
          text={t(`table.sort.${yearFilter === 'oldest' ? 'asc' : 'desc'}`)}
        >
          <Button variant="outline" size="sm" onClick={handleChangeYearSort}>
            {yearFilter === 'oldest' ? (
              <ArrowUp className="w-4 h-4" />
            ) : (
              <ArrowDown className="w-4 h-4" />
            )}
          </Button>
        </SimpleTooltip>
      )}

      {currentFilter === 'byGenre' && genres !== undefined && (
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
          {albumsPageFilterValues.map((item, index) => {
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
