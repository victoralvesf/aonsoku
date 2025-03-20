import { Volume2, VolumeX } from 'lucide-react'
import { WheelEvent } from 'react'
import { Slider } from '@/app/components/ui/slider'
import { usePlayerVolume, useVolumeSettings } from '@/store/player.store'

export function MiniPlayerVolume() {
  const { volume, setVolume, handleVolumeWheel } = usePlayerVolume()
  const { min, max, step } = useVolumeSettings()

  function handleWheel(e: WheelEvent) {
    const isScrollingDown = e.deltaY > 0
    handleVolumeWheel(isScrollingDown)
  }

  return (
    <div className="flex justify-between items-center gap-2 text-foreground/70">
      <VolumeX className="w-6 h-6 drop-shadow-lg" strokeWidth={1.75} />

      <Slider
        variant="secondary"
        defaultValue={[100]}
        value={[volume]}
        min={min}
        max={max}
        step={step}
        onValueChange={([value]) => setVolume(value)}
        onValueCommit={([value]) => setVolume(value)}
        onWheel={handleWheel}
      />

      <Volume2 className="w-6 h-6 drop-shadow-lg" strokeWidth={1.75} />
    </div>
  )
}
