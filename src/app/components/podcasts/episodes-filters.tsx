import { ArrowDown, ArrowUp, ListFilterIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { ExpandableSearchInput } from '@/app/components/search/expandable-input'
import { Button } from '@/app/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'
import { EpisodesOrderByOptions, SortOptions } from '@/utils/albumsFilter'
import { SearchParamsHandler } from '@/utils/searchParamsHandler'

export function EpisodesFilters() {
  const { t } = useTranslation()

  return (
    <div className="px-8 h-16 flex items-center justify-between">
      <h2 className="text-xl font-semibold">{t('podcasts.list.episodes')}</h2>

      <div className="flex gap-2">
        <ExpandableSearchInput
          placeholder={t('podcasts.filters.episodes.search')}
        />
        <DefaultSortFilter />
        <FilterDropdown />
      </div>
    </div>
  )
}

function FilterDropdown() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { getSearchParam } = new SearchParamsHandler(searchParams)
  const { PublishedAt, Title, Duration } = EpisodesOrderByOptions

  const orderByFilter = getSearchParam<EpisodesOrderByOptions>(
    'orderBy',
    PublishedAt,
  )

  function handleChangeFilter(value: EpisodesOrderByOptions) {
    setSearchParams((state) => {
      state.set('orderBy', value)

      return state
    })
  }

  const filters = [
    { label: 'publishDate', option: PublishedAt },
    { label: 'title', option: Title },
    { label: 'duration', option: Duration },
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
            {t(`podcasts.filters.episodes.orderBy.${label}`)}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

interface SortFilterProps {
  defaultSort?: SortOptions
}

export function DefaultSortFilter({
  defaultSort = SortOptions.Desc,
}: SortFilterProps) {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { getSearchParam } = new SearchParamsHandler(searchParams)
  const { Asc, Desc } = SortOptions

  const sortFilter = getSearchParam<SortOptions>('sort', defaultSort)
  const isDesc = sortFilter === Desc

  function yearFilterTooltip() {
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
    <SimpleTooltip text={yearFilterTooltip()}>
      <Button
        variant="outline"
        className="w-9 h-9 p-0"
        size="sm"
        onClick={handleChangeSort}
      >
        {isDesc ? (
          <ArrowUp className="w-4 h-4" />
        ) : (
          <ArrowDown className="w-4 h-4" />
        )}
      </Button>
    </SimpleTooltip>
  )
}
