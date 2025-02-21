import { ListFilterIcon } from 'lucide-react'
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
import { PodcastsOrderByOptions, SortOptions } from '@/utils/albumsFilter'
import { SearchParamsHandler } from '@/utils/searchParamsHandler'
import { DefaultSortFilter } from './episodes-filters'

export function PodcastsFilters() {
  const { t } = useTranslation()

  return (
    <>
      <ExpandableSearchInput placeholder={t('podcasts.form.search')} />

      <DefaultSortFilter defaultSort={SortOptions.Asc} />
      <OrderByFilter />
    </>
  )
}

function OrderByFilter() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { getSearchParam } = new SearchParamsHandler(searchParams)
  const { EpisodeCount, Title } = PodcastsOrderByOptions

  const orderByFilter = getSearchParam<PodcastsOrderByOptions>('orderBy', Title)

  function handleChangeFilter(value: PodcastsOrderByOptions) {
    setSearchParams((state) => {
      state.set('orderBy', value)

      return state
    })
  }

  const filters = [
    { label: 'title', option: Title },
    { label: 'episodeCount', option: EpisodeCount },
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
            {t(`podcasts.filters.podcasts.orderBy.${label}`)}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
