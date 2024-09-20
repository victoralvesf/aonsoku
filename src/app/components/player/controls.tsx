import clsx from 'clsx'
import {
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
} from 'lucide-react'
import { useEffect } from 'react'
import { type HotkeyCallback, type Keys, useHotkeys } from 'react-hotkeys-hook'
import { useTranslation } from 'react-i18next'
import { Button } from '@/app/components/ui/button'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'
import {
  usePlayerActions,
  usePlayerCurrentList,
  usePlayerIsPlaying,
  usePlayerLoop,
  usePlayerMediaType,
  usePlayerShuffle,
} from '@/store/player.store'
import { Radio } from '@/types/responses/radios'
import { ISong } from '@/types/responses/song'
import { manageMediaSession } from '@/utils/setMediaSession'

interface PlayerControlsProps {
  song: ISong
  radio: Radio
}

export function PlayerControls({ song, radio }: PlayerControlsProps) {
  const { t } = useTranslation()
  const mediaType = usePlayerMediaType()
  const isShuffleActive = usePlayerShuffle()
  const isLoopActive = usePlayerLoop()
  const isPlaying = usePlayerIsPlaying()
  const {
    isPlayingOneSong,
    toggleShuffle,
    toggleLoop,
    togglePlayPause,
    playPrevSong,
    playNextSong,
    hasNextSong,
    hasPrevSong,
  } = usePlayerActions()
  const currentList = usePlayerCurrentList()

  useAudioHotkeys('space', togglePlayPause)
  useAudioHotkeys('left', playPrevSong)
  useAudioHotkeys('right', playNextSong)
  useAudioHotkeys('s', toggleShuffle)
  useAudioHotkeys('r', toggleLoop)

  function useAudioHotkeys(keys: Keys, callback: HotkeyCallback) {
    useHotkeys(keys, callback, {
      preventDefault: true,
      enabled: currentList.length > 0,
    })
  }

  useEffect(() => {
    manageMediaSession.setHandlers({
      togglePlayPause,
      playPrev: playPrevSong,
      playNext: playNextSong,
    })
  }, [playNextSong, playPrevSong, togglePlayPause])

  const shuffleTooltip = isShuffleActive
    ? t('player.tooltips.shuffle.disable')
    : t('player.tooltips.shuffle.enable')
  const playTooltip = isPlaying
    ? t('player.tooltips.pause')
    : t('player.tooltips.play')
  const repeatTooltip = isLoopActive
    ? t('player.tooltips.repeat.disable')
    : t('player.tooltips.repeat.enable')

  return (
    <div className="flex w-full gap-1 justify-center items-center mb-1">
      {mediaType === 'song' && (
        <SimpleTooltip text={shuffleTooltip}>
          <Button
            variant="ghost"
            className={clsx(
              'relative rounded-full w-10 h-10 p-3',
              isShuffleActive && 'player-button-active',
            )}
            disabled={!song || isPlayingOneSong() || !hasNextSong()}
            onClick={toggleShuffle}
            data-testid="player-button-shuffle"
          >
            <Shuffle
              className={clsx('w-10 h-10', isShuffleActive && 'text-primary')}
            />
          </Button>
        </SimpleTooltip>
      )}

      <SimpleTooltip text={t('player.tooltips.previous')}>
        <Button
          variant="ghost"
          className="rounded-full w-10 h-10 p-3"
          disabled={(!song && !radio) || !hasPrevSong()}
          onClick={playPrevSong}
          data-testid="player-button-prev"
        >
          <SkipBack className="w-10 h-10 fill-secondary-foreground" />
        </Button>
      </SimpleTooltip>

      <SimpleTooltip text={playTooltip}>
        <Button
          className="rounded-full w-10 h-10 p-3"
          disabled={!song && !radio}
          onClick={togglePlayPause}
          data-testid={`player-button-${isPlaying ? 'pause' : 'play'}`}
        >
          {isPlaying ? (
            <Pause className="w-10 h-10 fill-slate-50 text-slate-50" />
          ) : (
            <Play className="w-10 h-10 fill-slate-50 text-slate-50" />
          )}
        </Button>
      </SimpleTooltip>

      <SimpleTooltip text={t('player.tooltips.next')}>
        <Button
          variant="ghost"
          className="rounded-full w-10 h-10 p-3"
          disabled={(!song && !radio) || !hasNextSong()}
          onClick={playNextSong}
          data-testid="player-button-next"
        >
          <SkipForward className="w-10 h-10 fill-secondary-foreground" />
        </Button>
      </SimpleTooltip>

      {mediaType === 'song' && (
        <SimpleTooltip text={repeatTooltip}>
          <Button
            variant="ghost"
            className={clsx(
              'relative rounded-full w-10 h-10 p-3',
              isLoopActive && 'player-button-active',
            )}
            disabled={!song}
            onClick={toggleLoop}
            data-testid="player-button-loop"
          >
            <Repeat
              className={clsx('w-10 h-10', isLoopActive && 'text-primary')}
            />
          </Button>
        </SimpleTooltip>
      )}
    </div>
  )
}
