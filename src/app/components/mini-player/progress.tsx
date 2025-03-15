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

export function MiniPlayerProgress() {
  const progress = usePlayerProgress()
  const [localProgress, setLocalProgress] = useState(progress)
  const { audioPlayerRef } = usePlayerState()
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
    <div className="flex items-center flex-col">
      <div className="w-full flex justify-between text-muted-foreground">
        <div className="min-w-[40px] text-left text-xs drop-shadow-md">
          {currentTime}
        </div>

        <div className="min-w-[40px] text-right text-xs drop-shadow-md">
          {convertSecondsToTime(currentDuration ?? 0)}
        </div>
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
        onPointerUp={handleSeekedFallback}
        onMouseUp={handleSeekedFallback}
      />
    </div>
  )
}
