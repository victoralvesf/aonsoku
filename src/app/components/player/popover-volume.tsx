import { ReactNode } from 'react'
import { Button } from '@/app/components/ui/button'
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from '@/app/components/ui/popover'
import { VolumeSlider } from './volume'

export function PopoverVolume({ children }: { children: ReactNode }) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          className="rounded-full w-10 h-10 p-2 text-secondary-foreground data-[state=open]:bg-accent"
        >
          {children}
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-fit h-10 px-4 py-0 flex items-center rounded-full"
        side="left"
        align="center"
      >
        <VolumeSlider className="w-24" />
      </PopoverContent>
    </Popover>
  )
}
