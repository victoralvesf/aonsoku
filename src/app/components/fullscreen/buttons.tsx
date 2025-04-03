import { ChevronDown } from 'lucide-react'
import { Button } from '@/app/components/ui/button'

export function CloseFullscreenButton() {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-10 rounded-full hover:bg-foreground/20"
      asChild
    >
      <div>
        <ChevronDown className="size-7" />
      </div>
    </Button>
  )
}
