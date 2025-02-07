import { VolumeX, Volume1, Volume2 } from 'lucide-react'
import { WheelEvent } from 'react'
import { Slider } from '@/app/components/ui/slider'
import { usePlayerVolume, useVolumeSettings } from '@/store/player.store'
import { buttonsStyle } from './controls'

export function VolumeContainer() {
  const { volume, setVolume, handleVolumeWheel } = usePlayerVolume()
  const { min, max, step } = useVolumeSettings()

  function handleWheel(e: WheelEvent) {
    const isScrollingDown = e.deltaY > 0
    handleVolumeWheel(isScrollingDown)
  }

  return (
    <div className="flex justify-center items-center gap-4 text-secondary-foreground">
      {volume >= 50 && <Volume2 className={buttonsStyle.secondaryIcon} />}
      {volume > 0 && volume < 50 && (
        <Volume1 className={buttonsStyle.secondaryIcon} />
      )}
      {volume === 0 && <VolumeX className={buttonsStyle.secondaryIcon} />}
      <Slider
        variant="secondary"
        defaultValue={[100]}
        tooltipValue={volume.toString()}
        value={[volume]}
        min={min}
        max={max}
        step={step}
        className="cursor-pointer h-3 w-[8rem]"
        onValueChange={([value]) => setVolume(value)}
        onValueCommit={([value]) => setVolume(value)}
        onWheel={handleWheel}
      />
    </div>
  )
}
