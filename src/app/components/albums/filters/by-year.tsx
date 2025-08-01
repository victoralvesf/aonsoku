import { ArrowDown, ArrowUp } from 'lucide-react'
import { useLayoutEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@/app/components/ui/button'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'
import {
  AlbumsSearchParams,
  PersistedAlbumListKeys,
  YearFilter,
  YearSortOptions,
} from '@/utils/albumsFilter'
import { scrollPageToTop } from '@/utils/scrollPageToTop'
import { SearchParamsHandler } from '@/utils/searchParamsHandler'

export function AlbumsFilterByYear() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { getSearchParam } = new SearchParamsHandler(searchParams)

  function getFilter() {
    return getSearchParam<YearFilter>(
      AlbumsSearchParams.YearFilter,
      YearSortOptions.Oldest,
    )
  }

  const yearFilter = getFilter()

  // biome-ignore lint/correctness/useExhaustiveDependencies: only when mounted
  useLayoutEffect(() => {
    const savedYear = localStorage.getItem(
      PersistedAlbumListKeys.YearFilter,
    ) as YearFilter | null

    const hasYearFilter = searchParams.has(AlbumsSearchParams.YearFilter)

    if (savedYear && !hasYearFilter) {
      setSearchParams((state) => {
        state.set(AlbumsSearchParams.YearFilter, savedYear)
        return state
      })
    }

    if (hasYearFilter) {
      const currentYear = getFilter()

      localStorage.setItem(PersistedAlbumListKeys.YearFilter, currentYear)
    }
  }, [])

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

      localStorage.setItem(PersistedAlbumListKeys.YearFilter, filter)

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
