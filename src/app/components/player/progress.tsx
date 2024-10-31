import clsx from 'clsx'
import {
  RefObject,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Slider } from '@/app/components/ui/slider'
import { subsonic } from '@/service/subsonic'
import {
  usePlayerActions,
  usePlayerDuration,
  usePlayerMediaType,
  usePlayerProgress,
  usePlayerSonglist,
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
  const { currentSong } = usePlayerSonglist()
  const mediaType = usePlayerMediaType()
  const { setProgress } = usePlayerActions()
  const isScrobbleSentRef = useRef(false)

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
      }
      setProgress(amount)
      setLocalProgress(amount)
    },
    [audioRef, setProgress],
  )

  function handleSeekedFallback() {
    if (localProgress !== progress) {
      setProgress(localProgress)
    }
  }

  const songDuration = useMemo(
    () => convertSecondsToTime(currentDuration ?? 0),
    [currentDuration],
  )

  const sendScrobble = useCallback(async (songId: string) => {
    await subsonic.scrobble.send(songId)
  }, [])

  useEffect(() => {
    if (mediaType === 'song') {
      const progressPercentage = (progress / currentDuration) * 100

      if (progressPercentage === 0) isScrobbleSentRef.current = false

      if (progressPercentage >= 50 && !isScrobbleSentRef.current) {
        sendScrobble(currentSong.id)
        isScrobbleSentRef.current = true
      }
    }
  }, [progress, currentDuration, mediaType, sendScrobble, currentSong.id])

  const currentTime = convertSecondsToTime(isSeeking ? localProgress : progress)

  return (
    <div
      className={clsx(
        'flex w-full justify-center items-center',
        !song && 'opacity-50',
      )}
    >
      <small
        className="text-xs text-muted-foreground min-w-10 text-left"
        data-testid="player-current-time"
      >
        {currentTime}
      </small>
      {song ? (
        <Slider
          defaultValue={[0]}
          value={isSeeking ? [localProgress] : [progress]}
          tooltipValue={currentTime}
          max={currentDuration}
          step={1}
          className="cursor-pointer w-[32rem]"
          onValueChange={([value]) => handleSeeking(value)}
          onValueCommit={([value]) => handleSeeked(value)}
          // Sometimes onValueCommit doesn't work properly
          // so we also have to set the value on pointer/mouse up events
          // see https://github.com/radix-ui/primitives/issues/1760
          onPointerUp={handleSeekedFallback}
          onMouseUp={handleSeekedFallback}
          data-testid="player-progress-slider"
        />
      ) : (
        <Slider
          defaultValue={[0]}
          max={100}
          step={1}
          disabled={true}
          className="cursor-pointer w-[32rem] pointer-events-none"
        />
      )}
      <small
        className="text-xs text-muted-foreground min-w-10 text-right"
        data-testid="player-duration-time"
      >
        {songDuration}
      </small>
    </div>
  )
}
