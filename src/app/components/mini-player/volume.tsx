import { Volume2, VolumeX } from 'lucide-react'
import { VolumeSlider } from '@/app/components/player/volume'

export function MiniPlayerVolume() {
  return (
    <div className="flex justify-between items-center gap-2 text-foreground/70">
      <VolumeX className="w-6 h-6 drop-shadow-lg" strokeWidth={1.75} />

      <VolumeSlider
        variant="secondary"
        className="w-full"
        tooltipValue={undefined}
      />

      <Volume2 className="w-6 h-6 drop-shadow-lg" strokeWidth={1.75} />
    </div>
  )
}
