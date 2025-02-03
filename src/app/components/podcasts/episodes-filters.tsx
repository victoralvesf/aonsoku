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
import { SearchParamsHandler } from '@/utils/searchParamsHandler'
import { SimpleTooltip } from '../ui/simple-tooltip'

export function EpisodesFilters() {
  return (
    <div className="px-8 h-16 flex items-center justify-between">
      <h2 className="text-xl font-semibold">Episodes</h2>

      <div className="flex gap-2">
        <EpisodesSort />
        <FilterDropdown />
      </div>
    </div>
  )
}

function FilterDropdown() {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm">
          <ListFilterIcon className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuCheckboxItem className="capitalize" checked={true}>
          Publish Date
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem className="capitalize">
          Title
        </DropdownMenuCheckboxItem>
        <DropdownMenuCheckboxItem className="capitalize">
          Duration
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function EpisodesSort() {
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()
  const { getSearchParam } = new SearchParamsHandler(searchParams)

  const sortFilter = getSearchParam<string>('sort', 'desc')

  function yearFilterTooltip() {
    if (sortFilter === 'desc') {
      return t('table.sort.asc')
    } else {
      return t('table.sort.desc')
    }
  }

  function handleChangeSort() {
    setSearchParams((state) => {
      const filter = sortFilter === 'desc' ? 'asc' : 'desc'

      state.set('sort', filter)

      return state
    })
  }

  return (
    <SimpleTooltip text={yearFilterTooltip()}>
      <Button variant="outline" size="sm" onClick={handleChangeSort}>
        {sortFilter === 'desc' ? (
          <ArrowUp className="w-4 h-4" />
        ) : (
          <ArrowDown className="w-4 h-4" />
        )}
      </Button>
    </SimpleTooltip>
  )
}
