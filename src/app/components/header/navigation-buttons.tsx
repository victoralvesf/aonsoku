import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { Button } from '@/app/components/ui/button'
import useNavigationHistory from '@/app/hooks/use-navigation-history'

export function NavigationButtons() {
  const navigate = useNavigate()
  const { canGoBack, canGoForward } = useNavigationHistory()

  return (
    <div className="flex gap-1">
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 rounded-md"
        disabled={!canGoBack}
        onClick={() => navigate(-1)}
      >
        <ChevronLeft className="w-6 h-6" strokeWidth={1.5} />
      </Button>
      <Button
        variant="ghost"
        size="sm"
        className="h-8 w-8 p-0 rounded-md"
        disabled={!canGoForward}
        onClick={() => navigate(1)}
      >
        <ChevronRight className="w-6 h-6" strokeWidth={1.5} />
      </Button>
    </div>
  )
}
