import { Volume, Volume1, Volume2 } from 'lucide-react'
import { Slider } from '@/app/components/ui/slider'
import { usePlayerActions, usePlayerState } from '@/store/player.store'

interface VolumeContainerProps {
  className: string
}

export function VolumeContainer({ className }: VolumeContainerProps) {
  const { volume } = usePlayerState()
  const { setVolume } = usePlayerActions()

  return (
    <div className="flex justify-center items-center gap-4">
      {volume >= 50 && <Volume2 className={className} />}
      {volume > 0 && volume < 50 && <Volume1 className={className} />}
      {volume === 0 && <Volume className={className} />}
      <Slider
        variant="secondary"
        defaultValue={[100]}
        value={[volume]}
        max={100}
        step={1}
        className="cursor-pointer h-3 w-[8rem]"
        onValueChange={([value]) => setVolume(value)}
        onValueCommit={([value]) => setVolume(value)}
      />
    </div>
  )
}
