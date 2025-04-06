import { useCallback, useState } from 'react'
import { ProgressSlider } from '@/app/components/ui/slider'
import {
  usePlayerActions,
  usePlayerDuration,
  usePlayerProgress,
  usePlayerRef,
} from '@/store/player.store'
import { convertSecondsToTime } from '@/utils/convertSecondsToTime'

let isSeeking = false

export function FullscreenProgress() {
  const progress = usePlayerProgress()
  const [localProgress, setLocalProgress] = useState(progress)
  const audioPlayerRef = usePlayerRef()
  const currentDuration = usePlayerDuration()
  const { setProgress } = usePlayerActions()

  const updateAudioCurrentTime = useCallback(
    (value: number) => {
      isSeeking = false
      if (audioPlayerRef) {
        audioPlayerRef.currentTime = value
      }
    },
    [audioPlayerRef],
  )

  const handleSeeking = useCallback((amount: number) => {
    isSeeking = true
    setLocalProgress(amount)
  }, [])

  const handleSeeked = useCallback(
    (amount: number) => {
      updateAudioCurrentTime(amount)
      setProgress(amount)
      setLocalProgress(amount)
    },
    [setProgress, updateAudioCurrentTime],
  )

  const handleSeekedFallback = useCallback(() => {
    if (localProgress !== progress) {
      updateAudioCurrentTime(localProgress)
      setProgress(localProgress)
    }
  }, [localProgress, progress, setProgress, updateAudioCurrentTime])

  const currentTime = convertSecondsToTime(isSeeking ? localProgress : progress)

  return (
    <div className="flex items-center gap-3">
      <div className="min-w-[50px] max-w-[60px] text-right drop-shadow-lg">
        {currentTime}
      </div>

      <ProgressSlider
        variant="secondary"
        defaultValue={[0]}
        value={isSeeking ? [localProgress] : [progress]}
        tooltipTransformer={convertSecondsToTime}
        max={currentDuration}
        step={1}
        className="w-full h-4"
        onValueChange={([value]) => handleSeeking(value)}
        onValueCommit={([value]) => handleSeeked(value)}
        onPointerUp={handleSeekedFallback}
        onMouseUp={handleSeekedFallback}
      />

      <div className="min-w-[50px] max-w-[60px] text-left drop-shadow-lg">
        {convertSecondsToTime(currentDuration ?? 0)}
      </div>
    </div>
  )
}
