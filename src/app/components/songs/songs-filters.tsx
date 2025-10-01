import { ArrowDown, ArrowUp, ListFilterIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@/app/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'
import { SongsOrderByOptions, SortOptions } from '@/utils/albumsFilter'
import { SearchParamsHandler } from '@/utils/searchParamsHandler'

interface SortFilterProps {
  defaultSort?: SortOptions
}

export function SongsSortFilter({
  defaultSort = SortOptions.Desc,
}: SortFilterProps) {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { getSearchParam } = new SearchParamsHandler(searchParams)
  const { Asc, Desc } = SortOptions

  const sortFilter = getSearchParam<SortOptions>('sort', defaultSort)
  const isDesc = sortFilter === Desc

  function sortFilterTooltip() {
    if (isDesc) {
      return t('table.sort.asc')
    } else {
      return t('table.sort.desc')
    }
  }

  function handleChangeSort() {
    setSearchParams((state) => {
      state.set('sort', isDesc ? Asc : Desc)
      return state
    })
  }

  return (
    <SimpleTooltip text={sortFilterTooltip()}>
      <Button
        variant="outline"
        className="w-9 h-9 p-0"
        size="sm"
        onClick={handleChangeSort}
      >
        {isDesc ? (
          <ArrowDown className="w-4 h-4" />
        ) : (
          <ArrowUp className="w-4 h-4" />
        )}
      </Button>
    </SimpleTooltip>
  )
}

export function SongsOrderByFilter() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { getSearchParam } = new SearchParamsHandler(searchParams)
  const { LastAdded, Artist, Title, Album } = SongsOrderByOptions

  const orderByFilter = getSearchParam<SongsOrderByOptions>(
    'orderBy',
    LastAdded,
  )

  function handleChangeFilter(value: SongsOrderByOptions) {
    setSearchParams((state) => {
      state.set('orderBy', value)
      return state
    })
  }

  const filters = [
    { label: 'songs.sort.lastAdded', option: LastAdded },
    { label: 'songs.sort.artist', option: Artist },
    { label: 'songs.sort.title', option: Title },
    { label: 'songs.sort.album', option: Album },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="w-9 h-9 p-0" size="sm">
          <ListFilterIcon className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[200px]">
        {filters.map(({ label, option }) => (
          <DropdownMenuCheckboxItem
            key={option}
            checked={orderByFilter === option}
            onCheckedChange={() => handleChangeFilter(option)}
          >
            {t(label)}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}