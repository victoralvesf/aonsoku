import { useCallback, useState } from 'react'
import { Slider } from '@/app/components/ui/slider'
import {
  usePlayerActions,
  usePlayerDuration,
  usePlayerProgress,
  usePlayerState,
} from '@/store/player.store'
import { convertSecondsToTime } from '@/utils/convertSecondsToTime'

let isSeeking = false

export function FullscreenProgress() {
  const progress = usePlayerProgress()
  const [localProgress, setLocalProgress] = useState(progress)
  const { audioPlayerRef } = usePlayerState()
  const currentDuration = usePlayerDuration()
  const { setProgress } = usePlayerActions()

  const handleSeeking = useCallback((amount: number) => {
    isSeeking = true
    setLocalProgress(amount)
  }, [])

  const handleSeeked = useCallback(
    (amount: number) => {
      isSeeking = false

      if (audioPlayerRef) {
        audioPlayerRef.currentTime = amount
      }
      setProgress(amount)
      setLocalProgress(amount)
    },
    [audioPlayerRef, setProgress],
  )

  return (
    <div className="flex items-center">
      <div className="min-w-[55px] text-left drop-shadow-lg">
        {convertSecondsToTime(isSeeking ? localProgress : progress)}
      </div>

      <Slider
        variant="secondary"
        defaultValue={[0]}
        value={isSeeking ? [localProgress] : [progress]}
        max={currentDuration}
        step={1}
        className="w-full h-4"
        onValueChange={([value]) => handleSeeking(value)}
        onValueCommit={([value]) => handleSeeked(value)}
      />

      <div className="min-w-[55px] text-right drop-shadow-lg">
        {convertSecondsToTime(currentDuration ?? 0)}
      </div>
    </div>
  )
}
