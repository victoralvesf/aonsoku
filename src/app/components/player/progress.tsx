import { RefObject, useCallback, useState } from 'react'
import { Slider } from '@/app/components/ui/slider'
import {
  usePlayerActions,
  usePlayerDuration,
  usePlayerProgress,
} from '@/store/player.store'
import { ISong } from '@/types/responses/song'
import { convertSecondsToTime } from '@/utils/convertSecondsToTime'

interface PlayerProgressProps {
  audioRef: RefObject<HTMLAudioElement>
  song: ISong
}

let isSeeking = false

export function PlayerProgress({ audioRef, song }: PlayerProgressProps) {
  const progress = usePlayerProgress()
  const [localProgress, setLocalProgress] = useState(progress)
  const currentDuration = usePlayerDuration()
  const { setProgress } = usePlayerActions()

  const handleSeeking = useCallback(
    (amount: number) => {
      isSeeking = true
      setLocalProgress(amount)
    },
    [setLocalProgress],
  )

  const handleSeeked = useCallback(
    (amount: number) => {
      isSeeking = false
      if (audioRef.current) {
        audioRef.current.currentTime = amount
        setProgress(amount)
        setLocalProgress(amount)
      }
    },
    [audioRef, setProgress],
  )

  return (
    <div className="flex w-full justify-center items-center">
      <small className="text-xs text-muted-foreground min-w-10 text-left">
        {convertSecondsToTime(isSeeking ? localProgress : progress)}
      </small>
      {song ? (
        <Slider
          defaultValue={[0]}
          value={isSeeking ? [localProgress] : [progress]}
          max={currentDuration}
          step={1}
          className="cursor-pointer w-[32rem]"
          onValueChange={([value]) => handleSeeking(value)}
          onValueCommit={([value]) => handleSeeked(value)}
        />
      ) : (
        <Slider
          defaultValue={[0]}
          max={100}
          step={1}
          showThumb={false}
          className="cursor-pointer w-[32rem] pointer-events-none"
        />
      )}
      <small className="text-xs text-muted-foreground min-w-10 text-right">
        {convertSecondsToTime(currentDuration ?? 0)}
      </small>
    </div>
  )
}
