import { Volume, Volume1, Volume2 } from 'lucide-react'
import { useState } from 'react'
import { usePlayer } from '@/app/contexts/player-context'
import { Slider } from '../ui/slider'

interface VolumeContainerProps {
  className: string
}

export function VolumeContainer({ className }: VolumeContainerProps) {
  const { volume, setVolume, audioPlayerRef } = usePlayer()
  const [localVolume, setLocalVolume] = useState(volume)

  function handleVolumeChange(value: number) {
    setLocalVolume(value)
    if (audioPlayerRef && audioPlayerRef.current) {
      audioPlayerRef.current.volume = value / 100
    }
  }

  return (
    <div className="flex justify-center items-center gap-4">
      {volume >= 50 && <Volume2 className={className} />}
      {volume > 0 && volume < 50 && <Volume1 className={className} />}
      {volume === 0 && <Volume className={className} />}
      <Slider
        variant="secondary"
        defaultValue={[100]}
        value={[localVolume]}
        max={100}
        step={1}
        className="cursor-pointer h-3 w-[8rem]"
        onValueChange={([value]) => handleVolumeChange(value)}
        onValueCommit={([value]) => setVolume(value)}
      />
    </div>
  )
}
