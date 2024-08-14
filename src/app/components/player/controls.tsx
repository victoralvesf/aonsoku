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
import { useHotkeys } from 'react-hotkeys-hook'
import { Button } from '@/app/components/ui/button'
import {
  usePlayerActions,
  usePlayerIsPlaying,
  usePlayerLoop,
  usePlayerMediaType,
  usePlayerShuffle,
  usePlayerSonglist,
} from '@/store/player.store'
import { Radio } from '@/types/responses/radios'
import { ISong } from '@/types/responses/song'
import { manageMediaSession } from '@/utils/setMediaSession'

interface PlayerControlsProps {
  song: ISong
  radio: Radio
}

export function PlayerControls({ song, radio }: PlayerControlsProps) {
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
  const { currentList } = usePlayerSonglist()

  useHotkeys(
    'space',
    () => {
      if (currentList.length > 0) {
        togglePlayPause()
      }
    },
    { preventDefault: true },
  )

  useEffect(() => {
    manageMediaSession.setHandlers({
      togglePlayPause,
      playPrev: playPrevSong,
      playNext: playNextSong,
    })
  }, [playNextSong, playPrevSong, togglePlayPause])

  return (
    <div className="flex w-full gap-1 justify-center items-center mb-1">
      {mediaType === 'song' && (
        <Button
          variant="ghost"
          className={clsx(
            'relative rounded-full w-10 h-10 p-3',
            isShuffleActive && 'player-button-active',
          )}
          disabled={!song || isPlayingOneSong() || !hasNextSong()}
          onClick={toggleShuffle}
        >
          <Shuffle
            className={clsx('w-10 h-10', isShuffleActive && 'text-primary')}
          />
        </Button>
      )}

      <Button
        variant="ghost"
        className="rounded-full w-10 h-10 p-3"
        disabled={(!song && !radio) || !hasPrevSong()}
        onClick={playPrevSong}
      >
        <SkipBack className="w-10 h-10 fill-secondary-foreground" />
      </Button>

      <Button
        className="rounded-full w-10 h-10 p-3"
        disabled={!song && !radio}
        onClick={togglePlayPause}
      >
        {isPlaying ? (
          <Pause className="w-10 h-10 fill-slate-50 text-slate-50" />
        ) : (
          <Play className="w-10 h-10 fill-slate-50 text-slate-50" />
        )}
      </Button>

      <Button
        variant="ghost"
        className="rounded-full w-10 h-10 p-3"
        disabled={(!song && !radio) || !hasNextSong()}
        onClick={playNextSong}
      >
        <SkipForward className="w-10 h-10 fill-secondary-foreground" />
      </Button>

      {mediaType === 'song' && (
        <Button
          variant="ghost"
          className={clsx(
            'relative rounded-full w-10 h-10 p-3',
            isLoopActive && 'player-button-active',
          )}
          disabled={!song}
          onClick={toggleLoop}
        >
          <Repeat
            className={clsx('w-10 h-10', isLoopActive && 'text-primary')}
          />
        </Button>
      )}
    </div>
  )
}
