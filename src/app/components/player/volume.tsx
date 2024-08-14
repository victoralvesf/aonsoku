import clsx from 'clsx'
import { Volume, Volume1, Volume2 } from 'lucide-react'
import { RefObject, useEffect } from 'react'
import { Slider } from '@/app/components/ui/slider'
import { usePlayerVolume } from '@/store/player.store'

interface PlayerVolumeProps {
  disabled: boolean
  audioRef: RefObject<HTMLAudioElement>
}

export function PlayerVolume({ disabled, audioRef }: PlayerVolumeProps) {
  const { volume, setVolume } = usePlayerVolume()

  useEffect(() => {
    if (!audioRef.current) return

    audioRef.current.volume = volume / 100
  }, [audioRef, volume])

  return (
    <div className="flex gap-2 ml-2">
      <div className={clsx(disabled && 'opacity-50')}>
        {volume >= 50 && <Volume2 className="w-4 h-4" />}
        {volume > 0 && volume < 50 && <Volume1 className="w-4 h-4" />}
        {volume === 0 && <Volume className="w-4 h-4" />}
      </div>
      <Slider
        defaultValue={[100]}
        value={[volume]}
        max={100}
        step={1}
        disabled={disabled}
        className={clsx(
          'cursor-pointer',
          'w-[8rem]',
          disabled && 'pointer-events-none opacity-50',
        )}
        onValueChange={([value]) => setVolume(value)}
        data-testid="player-volume-slider"
      />
    </div>
  )
}
