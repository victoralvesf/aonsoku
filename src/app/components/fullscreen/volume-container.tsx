import { Volume, Volume1, Volume2 } from 'lucide-react'
import { usePlayer } from '@/app/contexts/player-context'
import { Slider } from '../ui/slider'

interface VolumeContainerProps {
  className: string
}

export function VolumeContainer({ className }: VolumeContainerProps) {
  const player = usePlayer()

  return (
    <div className="flex justify-center items-center gap-4">
      {player.volume >= 50 && <Volume2 className={className} />}
      {player.volume > 0 && player.volume < 50 && (
        <Volume1 className={className} />
      )}
      {player.volume === 0 && <Volume className={className} />}
      <Slider
        variant="secondary"
        defaultValue={[100]}
        value={[player.volume]}
        max={100}
        step={1}
        className="cursor-pointer h-3 w-[8rem]"
        onValueChange={([value]) => player.setVolume(value)}
      />
    </div>
  )
}
