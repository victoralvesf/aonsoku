import { clsx } from 'clsx'
import {
  Heart,
  ListVideo,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume,
  Volume1,
  Volume2,
} from 'lucide-react'
import { useEffect, useRef, useCallback, memo } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'

import { getSongStreamUrl } from '@/api/httpClient'
import { RadioInfo } from '@/app/components/player/radio-info'
import { TrackInfo } from '@/app/components/player/track-info'
import { Button } from '@/app/components/ui/button'
import { Slider } from '@/app/components/ui/slider'
import {
  usePlayerActions,
  usePlayerIsPlaying,
  usePlayerSonglist,
  usePlayerState,
  usePlayerVolume,
} from '@/store/player.store'
import { PlayerProgress } from './progress'

const MemoizedTrackInfo = memo(TrackInfo)
const MemoizedRadioInfo = memo(RadioInfo)

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const {
    togglePlayPause,
    setAudioPlayerRef,
    setCurrentDuration,
    setProgress,
    hasNextSong,
    hasPrevSong,
    playNextSong,
    playPrevSong,
    clearPlayerState,
    isPlayingOneSong,
    toggleShuffle,
    toggleLoop,
    starCurrentSong,
    setPlayingState,
  } = usePlayerActions()
  const {
    mediaType,
    audioPlayerRef,
    currentDuration,
    isLoopActive,
    isSongStarred,
    isShuffleActive,
  } = usePlayerState()
  const { currentList, currentSongIndex, radioList } = usePlayerSonglist()
  const isPlaying = usePlayerIsPlaying()
  const { volume, setVolume } = usePlayerVolume()

  const song = currentList[currentSongIndex]
  const radio = radioList[currentSongIndex]

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
    if (mediaType !== 'song' && !song) return

    if (audioPlayerRef === null && audioRef.current)
      setAudioPlayerRef(audioRef.current)
  }, [audioPlayerRef, audioRef, mediaType, setAudioPlayerRef, song])

  useEffect(() => {
    if (!audioRef.current) return

    if (mediaType === 'radio') {
      if (isPlaying) {
        audioRef.current.src = ''
        audioRef.current.src = radio.streamUrl
        audioRef.current.play()
      } else {
        audioRef.current.pause()
      }
    }

    if (mediaType === 'song') {
      isPlaying ? audioRef.current.play() : audioRef.current.pause()
    }
  }, [isPlaying, mediaType, radio])

  useEffect(() => {
    if (!audioRef.current) return

    audioRef.current.volume = volume / 100
  }, [volume])

  const setupProgressListener = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.currentTime = 0
    const audioDuration = Math.floor(audio.duration)

    if (currentDuration !== audioDuration) {
      setCurrentDuration(audioDuration)
    }

    const handleTimeUpdate = () => {
      setProgress(Math.floor(audio.currentTime))
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
    }
  }, [currentDuration, setCurrentDuration, setProgress])

  const handleSongEnded = useCallback(() => {
    if (hasNextSong()) {
      playNextSong()
      audioRef.current?.play()
    } else {
      clearPlayerState()
    }
  }, [clearPlayerState, hasNextSong, playNextSong])

  return (
    <div className="border-t h-[100px] w-full flex items-center">
      <div className="w-full h-full grid grid-cols-player gap-2 px-4">
        {/* Track Info */}
        <div className="flex items-center gap-2">
          {mediaType === 'song' && <MemoizedTrackInfo song={song} />}
          {mediaType === 'radio' && <MemoizedRadioInfo radio={radio} />}
        </div>
        {/* Main Controls */}
        <div className="col-span-2 flex flex-col justify-center items-center px-4 gap-1">
          <div className="flex w-full gap-1 justify-center items-center mb-1">
            {mediaType === 'song' && (
              <Button
                variant="ghost"
                className={clsx(
                  'relative rounded-full w-10 h-10 p-3',
                  isShuffleActive && 'player-button-active',
                )}
                disabled={!song || isPlayingOneSong()}
                onClick={toggleShuffle}
              >
                <Shuffle
                  className={clsx(
                    'w-10 h-10',
                    isShuffleActive && 'text-primary',
                  )}
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

          {mediaType === 'song' && (
            <PlayerProgress audioRef={audioRef} song={song} />
          )}
        </div>
        {/* Remain Controls and Volume */}
        <div className="flex items-center w-full justify-end">
          <div className="flex items-center gap-1">
            {mediaType === 'song' && (
              <Button
                variant="ghost"
                className="rounded-full w-10 h-10 p-3"
                disabled={!song}
                onClick={starCurrentSong}
              >
                <Heart
                  className={clsx(
                    'w-5 h-5',
                    isSongStarred && 'text-red-500 fill-red-500',
                  )}
                />
              </Button>
            )}

            {mediaType === 'song' && (
              <Button
                variant="ghost"
                className="rounded-full w-10 h-10 p-2"
                disabled={!song}
              >
                <ListVideo className="w-4 h-4" />
              </Button>
            )}

            <div className="flex gap-2 ml-2">
              <div className={clsx(!song && !radio && 'opacity-50')}>
                {volume >= 50 && <Volume2 className="w-4 h-4" />}
                {volume > 0 && volume < 50 && <Volume1 className="w-4 h-4" />}
                {volume === 0 && <Volume className="w-4 h-4" />}
              </div>
              <Slider
                defaultValue={[100]}
                value={[volume]}
                max={100}
                step={1}
                disabled={!song && !radio}
                className={clsx(
                  'cursor-pointer',
                  'w-[8rem]',
                  !song && !radio && 'pointer-events-none opacity-50',
                )}
                onValueChange={([value]) => setVolume(value)}
              />
            </div>
          </div>
        </div>
      </div>

      {mediaType === 'song' && song && (
        <audio
          src={getSongStreamUrl(song.id)}
          autoPlay={true}
          ref={audioRef}
          loop={isLoopActive}
          onPlay={() => setPlayingState(true)}
          onPause={() => setPlayingState(false)}
          onLoadedMetadata={setupProgressListener}
          onEnded={handleSongEnded}
        />
      )}

      {mediaType === 'radio' && radio && (
        <audio
          src={radio.streamUrl}
          autoPlay={true}
          ref={audioRef}
          onPlay={() => setPlayingState(true)}
          onPause={() => setPlayingState(false)}
        />
      )}
    </div>
  )
}
