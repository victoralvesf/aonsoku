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
import { convertSecondsToTime } from '@/utils/convertSecondsToTime'

interface PlayerProgressProps {
  audioRef: RefObject<HTMLAudioElement>
}

let isSeeking = false

export function PlayerProgress({ audioRef }: PlayerProgressProps) {
  const progress = usePlayerProgress()
  const [localProgress, setLocalProgress] = useState(progress)
  const currentDuration = usePlayerDuration()
  const { currentSong, currentList } = usePlayerSonglist()
  const { isSong, isPodcast } = usePlayerMediaType()
  const { setProgress } = usePlayerActions()
  const isScrobbleSentRef = useRef(false)

  const isEmpty = isSong && currentList.length === 0

  const updateAudioCurrentTime = useCallback(
    (value: number) => {
      isSeeking = false
      if (audioRef.current) {
        audioRef.current.currentTime = value
      }
    },
    [audioRef],
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

  const songDuration = useMemo(
    () => convertSecondsToTime(currentDuration ?? 0),
    [currentDuration],
  )

  const sendScrobble = useCallback(async (songId: string) => {
    await subsonic.scrobble.send(songId)
  }, [])

  useEffect(() => {
    if (isSong) {
      const progressPercentage = (progress / currentDuration) * 100

      if (progressPercentage === 0) isScrobbleSentRef.current = false

      if (progressPercentage >= 50 && !isScrobbleSentRef.current) {
        sendScrobble(currentSong.id)
        isScrobbleSentRef.current = true
      }
    }
  }, [progress, currentDuration, isSong, sendScrobble, currentSong.id])

  const currentTime = convertSecondsToTime(isSeeking ? localProgress : progress)
  const progressMoreThanOneHour = localProgress >= 3600 || progress >= 3600

  return (
    <div
      className={clsx(
        'flex w-full justify-center items-center',
        isEmpty && 'opacity-50',
      )}
    >
      <small
        className={clsx(
          'text-xs text-muted-foreground text-left',
          progressMoreThanOneHour ? 'min-w-14' : 'min-w-10',
        )}
        data-testid="player-current-time"
      >
        {currentTime}
      </small>
      {!isEmpty || isPodcast ? (
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
        className="text-xs text-muted-foreground text-right pl-2.5"
        data-testid="player-duration-time"
      >
        {songDuration}
      </small>
    </div>
  )
}
