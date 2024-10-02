import clsx from 'clsx'
import { VolumeX, Volume1, Volume2 } from 'lucide-react'
import { RefObject, useEffect, WheelEvent } from 'react'
import { Slider } from '@/app/components/ui/slider'
import { usePlayerVolume, useVolumeSettings } from '@/store/player.store'

interface PlayerVolumeProps {
  disabled: boolean
  audioRef: RefObject<HTMLAudioElement>
}

export function PlayerVolume({ disabled, audioRef }: PlayerVolumeProps) {
  const { volume, setVolume, handleVolumeWheel } = usePlayerVolume()
  const { min, max, step } = useVolumeSettings()

  useEffect(() => {
    if (!audioRef.current) return

    audioRef.current.volume = volume / 100
  }, [audioRef, volume])

  function handleWheel(e: WheelEvent) {
    const isScrollingDown = e.deltaY > 0
    handleVolumeWheel(isScrollingDown)
  }

  return (
    <div className="flex gap-2 ml-2 items-center">
      <div className={clsx(disabled && 'opacity-50')}>
        {volume >= 50 && <Volume2 className="w-[18px] h-[18px]" />}
        {volume > 0 && volume < 50 && <Volume1 className="w-[18px] h-[18px]" />}
        {volume === 0 && <VolumeX className="w-[18px] h-[18px]" />}
      </div>
      <Slider
        value={[volume]}
        tooltipValue={volume.toString()}
        min={min}
        max={max}
        step={step}
        disabled={disabled}
        className={clsx(
          'cursor-pointer',
          'w-[8rem]',
          disabled && 'pointer-events-none opacity-50',
        )}
        onValueChange={([value]) => setVolume(value)}
        onWheel={handleWheel}
        data-testid="player-volume-slider"
      />
    </div>
  )
}
