import { useCallback, useState } from 'react'
import { Slider } from '@/app/components/ui/slider'
import {
  usePlayerActions,
  usePlayerDuration,
  usePlayerProgress,
  usePlayerRef,
} from '@/store/player.store'
import { convertSecondsToTime } from '@/utils/convertSecondsToTime'

let isSeeking = false

export function MiniPlayerProgress() {
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
    <div className="flex items-center flex-col">
      <div className="w-full flex justify-between text-foreground/70">
        <div className="min-w-[40px] text-left text-[11px] font-light drop-shadow-md">
          {currentTime}
        </div>

        <div className="min-w-[40px] text-right text-[11px] font-light drop-shadow-md">
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
