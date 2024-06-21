import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/app/components/ui/popover'
import { Button } from '@/app/components/ui/button'
import { Volume2 } from 'lucide-react'
import { Slider } from '../ui/slider'
import { usePlayer } from '@/app/contexts/player-context'

export function VolumePopover() {
  const player = usePlayer()

  return (
    <Popover modal={true}>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          variant="ghost"
          className="w-12 h-12 p-2 rounded-full"
        >
          <Volume2 className="w-6 h-6" strokeWidth={1.5} />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="p-4 w-56" side="top">
        <Slider
          defaultValue={[100]}
          value={[player.volume]}
          max={100}
          step={1}
          className="cursor-pointer h-3"
          onValueChange={([value]) => player.setVolume(value)}
        />
      </PopoverContent>
    </Popover>
  )
}
