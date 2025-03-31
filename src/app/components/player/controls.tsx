import clsx from 'clsx'
import {
  Pause,
  Play,
  Repeat,
  RotateCcwIcon,
  RotateCwIcon,
  Shuffle,
  SkipBack,
  SkipForward,
} from 'lucide-react'
import {
  ComponentPropsWithoutRef,
  RefObject,
  useCallback,
  useEffect,
} from 'react'
import { useTranslation } from 'react-i18next'
import RepeatOne from '@/app/components/icons/repeat-one'
import { Button } from '@/app/components/ui/button'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'
import { usePlayerHotkeys } from '@/app/hooks/use-audio-hotkeys'
import { cn } from '@/lib/utils'
import {
  usePlayerActions,
  usePlayerIsPlaying,
  usePlayerLoop,
  usePlayerMediaType,
  usePlayerShuffle,
  usePlayerPrevAndNext,
} from '@/store/player.store'
import { LoopState } from '@/types/playerContext'
import { EpisodeWithPodcast } from '@/types/responses/podcasts'
import { Radio } from '@/types/responses/radios'
import { ISong } from '@/types/responses/song'
import { manageMediaSession } from '@/utils/setMediaSession'

interface PlayerControlsProps {
  song: ISong
  radio: Radio
  podcast: EpisodeWithPodcast
  audioRef: RefObject<HTMLAudioElement>
}

export function PlayerControls({
  song,
  radio,
  podcast,
  audioRef,
}: PlayerControlsProps) {
  const { t } = useTranslation()
  const { isSong, isPodcast } = usePlayerMediaType()
  const isShuffleActive = usePlayerShuffle()
  const { hasPrev, hasNext } = usePlayerPrevAndNext()
  const loopState = usePlayerLoop()
  const isPlaying = usePlayerIsPlaying()
  const {
    isPlayingOneSong,
    toggleShuffle,
    toggleLoop,
    setPlayingState,
    togglePlayPause,
    playPrevSong,
    playNextSong,
  } = usePlayerActions()
  const { useAudioHotkeys } = usePlayerHotkeys()

  useAudioHotkeys('space', togglePlayPause)
  useAudioHotkeys('mod+left', playPrevSong)
  useAudioHotkeys('mod+right', playNextSong)
  useAudioHotkeys('mod+s', toggleShuffle)
  useAudioHotkeys('mod+r', toggleLoop)

  const handleSeekAction = useCallback(
    (value: number) => {
      const audio = audioRef.current
      if (!audio) return

      audio.currentTime += value
    },
    [audioRef],
  )

  useEffect(() => {
    if (isPodcast) {
      manageMediaSession.setPodcastHandlers({
        setIsPlaying: setPlayingState,
        seekBackward: handleSeekAction,
        seekForward: handleSeekAction,
      })
    } else {
      manageMediaSession.setHandlers({
        setIsPlaying: setPlayingState,
        playPrev: playPrevSong,
        playNext: playNextSong,
      })
    }
  }, [
    handleSeekAction,
    isPodcast,
    playNextSong,
    playPrevSong,
    setPlayingState,
    togglePlayPause,
  ])

  const shuffleTooltip = isShuffleActive
    ? t('player.tooltips.shuffle.disable')
    : t('player.tooltips.shuffle.enable')
  const playTooltip = isPlaying
    ? t('player.tooltips.pause')
    : t('player.tooltips.play')

  const repeatTooltips = {
    0: t('player.tooltips.repeat.enable'),
    1: t('player.tooltips.repeat.enableOne'),
    2: t('player.tooltips.repeat.disable'),
  }
  const repeatTooltip = repeatTooltips[loopState]

  const cannotGotoNextSong = !hasNext && loopState !== LoopState.All
  const disableButtons = !song && !radio && !podcast

  return (
    <div className="flex w-full gap-1 justify-center items-center mb-1">
      {isSong && (
        <SimpleTooltip text={shuffleTooltip}>
          <PlayerButton
            className={clsx(isShuffleActive && 'player-button-active')}
            disabled={!song || isPlayingOneSong() || !hasNext}
            onClick={toggleShuffle}
            data-testid="player-button-shuffle"
          >
            <Shuffle
              className={clsx(
                isShuffleActive ? 'text-primary' : 'text-secondary-foreground',
              )}
            />
          </PlayerButton>
        </SimpleTooltip>
      )}

      <SimpleTooltip text={t('player.tooltips.previous')}>
        <PlayerButton
          disabled={disableButtons || !hasPrev}
          onClick={playPrevSong}
          data-testid="player-button-prev"
        >
          <SkipBack className="text-secondary-foreground fill-secondary-foreground" />
        </PlayerButton>
      </SimpleTooltip>

      {isPodcast && (
        <SimpleTooltip text={t('player.tooltips.rewind', { amount: 15 })}>
          <PlayerButton
            onClick={() => handleSeekAction(-15)}
            data-testid="player-button-skip-backward"
          >
            <span className="text-secondary-foreground font-light text-[8px] absolute">
              15
            </span>
            <RotateCcwIcon className="text-secondary-foreground" />
          </PlayerButton>
        </SimpleTooltip>
      )}

      <SimpleTooltip text={playTooltip}>
        <PlayerButton
          variant="default"
          disabled={!song && !radio && !isPodcast}
          onClick={togglePlayPause}
          data-testid={`player-button-${isPlaying ? 'pause' : 'play'}`}
        >
          {isPlaying ? (
            <Pause className="fill-primary-foreground" />
          ) : (
            <Play className="fill-primary-foreground" />
          )}
        </PlayerButton>
      </SimpleTooltip>

      {isPodcast && (
        <SimpleTooltip text={t('player.tooltips.forward', { amount: 30 })}>
          <PlayerButton
            onClick={() => handleSeekAction(30)}
            data-testid="player-button-skip-forward"
          >
            <span className="text-secondary-foreground font-light text-[8px] absolute">
              30
            </span>
            <RotateCwIcon className="text-secondary-foreground" />
          </PlayerButton>
        </SimpleTooltip>
      )}

      <SimpleTooltip text={t('player.tooltips.next')}>
        <PlayerButton
          disabled={disableButtons || cannotGotoNextSong}
          onClick={playNextSong}
          data-testid="player-button-next"
        >
          <SkipForward className="text-secondary-foreground fill-secondary-foreground" />
        </PlayerButton>
      </SimpleTooltip>

      {isSong && (
        <SimpleTooltip text={repeatTooltip}>
          <PlayerButton
            className={clsx(
              loopState !== LoopState.Off && 'player-button-active',
            )}
            disabled={!song}
            onClick={toggleLoop}
            data-testid="player-button-loop"
          >
            {loopState === LoopState.Off && (
              <Repeat className="text-secondary-foreground" />
            )}
            {loopState === LoopState.All && <Repeat className="text-primary" />}
            {loopState === LoopState.One && (
              <RepeatOne className="text-primary" />
            )}
          </PlayerButton>
        </SimpleTooltip>
      )}
    </div>
  )
}

type PlayerButtonProps = ComponentPropsWithoutRef<typeof Button>

function PlayerButton({ className, ...props }: PlayerButtonProps) {
  return (
    <Button
      variant="ghost"
      className={cn(
        'relative rounded-full size-10 p-0 [&_svg]:pointer-events-none [&_svg]:size-[18px] [&_svg]:shrink-0',
        className,
      )}
      {...props}
    />
  )
}
