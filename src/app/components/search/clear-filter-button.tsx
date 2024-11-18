import { FilterX } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { Button } from '@/app/components/ui/button'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'

export function ClearFilterButton() {
  const { t } = useTranslation()
  const [, setSearchParams] = useSearchParams()

  function handleClearFilter() {
    setSearchParams(new URLSearchParams())
  }

  return (
    <SimpleTooltip text={t('songs.list.filter.clear')} side="left">
      <Button
        variant="outline"
        size="icon"
        className="w-9 h-9"
        onClick={handleClearFilter}
      >
        <FilterX className="w-4 h-4 text-muted-foreground" />
      </Button>
    </SimpleTooltip>
  )
}
