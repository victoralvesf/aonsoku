import { ChevronDown } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { useBigPlayerState } from '@/store/player.store'
import { buttonsStyle } from './controls'

export function CloseFullscreenButton() {
  const { toggleBigPlayerState } = useBigPlayerState()

  return (
    <Button
      variant="ghost"
      size="icon"
      className={buttonsStyle.secondary}
      onClick={toggleBigPlayerState}
      style={{ ...buttonsStyle.style }}
    >
      <ChevronDown className="size-9 drop-shadow-lg" strokeWidth={1.5} />
    </Button>
  )
}
