import { ChevronDown } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { DrawerClose } from '@/app/components/ui/drawer'
import { buttonsStyle } from './controls'

export function CloseFullscreenButton() {
  return (
    <DrawerClose asChild>
      <Button
        variant="ghost"
        size="icon"
        className={buttonsStyle.secondary}
        style={{ ...buttonsStyle.style }}
      >
        <ChevronDown className="size-9 drop-shadow-lg" strokeWidth={1.5} />
      </Button>
    </DrawerClose>
  )
}
