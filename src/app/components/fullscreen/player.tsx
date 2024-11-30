import { FullscreenControls } from './controls'
import { LikeButton } from './like-button'
import { FullscreenProgress } from './progress'
import { VolumeContainer } from './volume-container'

export function FullscreenPlayer() {
  return (
    <div className="w-full">
      <FullscreenProgress />

      <div className="flex items-center justify-between gap-4 mt-5">
        <div className="w-[200px] flex justify-start">
          <LikeButton />
        </div>

        <div className="flex flex-1 justify-center items-center gap-2">
          <FullscreenControls />
        </div>

        <div className="w-[200px] flex justify-end">
          <VolumeContainer />
        </div>
      </div>
    </div>
  )
}
