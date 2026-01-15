import { ChevronDown } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { useBigPlayerState } from '@/store/player.store'

export function CloseFullscreenButton() {
  const { toggleBigPlayerState } = useBigPlayerState()

  return (
    <Button
      variant="ghost"
      size="icon"
      className="size-10 rounded-full hover:bg-foreground/20"
      onClick={toggleBigPlayerState}
    >
      <ChevronDown className="size-7" />
    </Button>
  )
}
