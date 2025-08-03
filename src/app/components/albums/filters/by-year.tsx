import { ArrowDown, ArrowUp } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@/app/components/ui/button'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'
import {
  AlbumsSearchParams,
  YearFilter,
  YearSortOptions,
} from '@/utils/albumsFilter'
import { scrollPageToTop } from '@/utils/scrollPageToTop'
import { SearchParamsHandler } from '@/utils/searchParamsHandler'

export function AlbumsFilterByYear() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { getSearchParam } = new SearchParamsHandler(searchParams)

  const yearFilter = getSearchParam<YearFilter>(
    AlbumsSearchParams.YearFilter,
    YearSortOptions.Oldest,
  )

  function yearFilterTooltip() {
    if (yearFilter === YearSortOptions.Oldest) {
      return t('table.sort.asc')
    } else {
      return t('table.sort.desc')
    }
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
    scrollPageToTop()
  }

  return (
    <SimpleTooltip text={yearFilterTooltip()}>
      <Button variant="outline" size="sm" onClick={handleChangeYearSort}>
        {yearFilter === YearSortOptions.Oldest ? (
          <ArrowUp className="w-4 h-4" />
        ) : (
          <ArrowDown className="w-4 h-4" />
        )}
      </Button>
    </SimpleTooltip>
  )
}
