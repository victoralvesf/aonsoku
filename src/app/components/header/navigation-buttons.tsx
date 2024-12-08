import clsx from 'clsx'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import useNavigationHistory from '@/app/hooks/use-navigation-history'
import { useQueueDrawerState } from '@/store/player.store'

export function NavigationButtons() {
  const { canGoBack, canGoForward, goBack, goForward } = useNavigationHistory()
  const queueDrawerState = useQueueDrawerState()

  return (
    <div className="flex gap-1">
      <div className={clsx('w-8 h-8', !canGoBack && 'cursor-not-allowed')}>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 rounded-md"
          disabled={!canGoBack || queueDrawerState}
          onClick={goBack}
        >
          <ChevronLeft className="w-6 h-6" strokeWidth={1.5} />
        </Button>
      </div>
      <div className={clsx('w-8 h-8', !canGoForward && 'cursor-not-allowed')}>
        <Button
          variant="ghost"
          size="sm"
          className="h-8 w-8 p-0 rounded-md"
          disabled={!canGoForward || queueDrawerState}
          onClick={goForward}
        >
          <ChevronRight className="w-6 h-6" strokeWidth={1.5} />
        </Button>
      </div>
    </div>
  )
}
