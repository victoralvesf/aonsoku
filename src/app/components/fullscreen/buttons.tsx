import { ChevronDown } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { usePlayerFullscreen } from '@/store/player.store'
import { buttonsStyle } from './controls'

export function CloseFullscreenButton() {
  const { setIsFullscreen } = usePlayerFullscreen()

  return (
    <Button
      variant="ghost"
      size="icon"
      className={buttonsStyle.secondary}
      style={{ ...buttonsStyle.style }}
      onClick={() => setIsFullscreen(false)}
    >
      <ChevronDown className="size-9 drop-shadow-lg" strokeWidth={1.5} />
    </Button>
  )
}
