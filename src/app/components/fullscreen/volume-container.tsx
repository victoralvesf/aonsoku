import { VolumeIcon } from '@/app/components/icons/volume-icon'
import { MuteButton, VolumeSlider } from '@/app/components/player/volume'
import { usePlayerVolume } from '@/store/player.store'
import { buttonsStyle } from './controls'

export function VolumeContainer() {
  const { volume } = usePlayerVolume()

  return (
    <div className="flex justify-center items-center gap-1 text-secondary-foreground">
      <MuteButton className={buttonsStyle.secondary}>
        <VolumeIcon volume={volume} className={buttonsStyle.secondaryIcon} />
      </MuteButton>
      <VolumeSlider variant="secondary" className="h-3" />
    </div>
  )
}
