import clsx from 'clsx'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import useNavigationHistory from '@/app/hooks/use-navigation-history'
import { useMainDrawerState } from '@/store/player.store'

export function NavigationButtons() {
  const { canGoBack, canGoForward, goBack, goForward } = useNavigationHistory()
  const { mainDrawerState } = useMainDrawerState()

  return (
    <div className="flex gap-1">
      <div
        className={clsx(
          'size-8',
          !canGoBack && !mainDrawerState && 'cursor-not-allowed',
        )} >
        <Button
          variant="ghost"
          size="sm"
          className="size-8 p-0 rounded-md"
          disabled={!canGoBack || mainDrawerState}
          onClick={goBack}
        >
          <ChevronLeft className="size-5" />
        </Button>
      </div>

      <div
        className={clsx(
          'size-8',
          !canGoForward && !mainDrawerState && 'cursor-not-allowed',
        )} >
        <Button
          variant="ghost"
          size="sm"
          className="size-8 p-0 rounded-md"
          disabled={!canGoForward || mainDrawerState}
          onClick={goForward}
        >
          <ChevronRight className="size-5" />
        </Button>
      </div>
    </div>
  )
}
