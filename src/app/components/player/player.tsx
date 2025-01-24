import { useEffect, useRef, useCallback, memo } from 'react'

import { getSongStreamUrl } from '@/api/httpClient'
import { RadioInfo } from '@/app/components/player/radio-info'
import { TrackInfo } from '@/app/components/player/track-info'
import useMediaSession from '@/app/hooks/use-media-session'
import {
  usePlayerActions,
  usePlayerDuration,
  usePlayerIsPlaying,
  usePlayerLoop,
  usePlayerMediaType,
  usePlayerRef,
  usePlayerSonglist,
  getVolume,
  useReplayGainState,
} from '@/store/player.store'
import { LoopState } from '@/types/playerContext'
import { ReplayGainParams } from '@/utils/replayGain'
import { AudioPlayer } from './audio'
import { PlayerClearQueueButton } from './clear-queue-button'
import { PlayerControls } from './controls'
import { PlayerLikeButton } from './like-button'
import { PlayerProgress } from './progress'
import { PlayerSongListButton } from './song-list-button'
import { PlayerVolume } from './volume'

const MemoTrackInfo = memo(TrackInfo)
const MemoRadioInfo = memo(RadioInfo)
const MemoPlayerControls = memo(PlayerControls)
const MemoPlayerLikeButton = memo(PlayerLikeButton)
const MemoPlayerSongListButton = memo(PlayerSongListButton)
const MemoPlayerClearQueueButton = memo(PlayerClearQueueButton)
const MemoPlayerVolume = memo(PlayerVolume)

export function Player() {
  const audioRef = useRef<HTMLAudioElement>(null)
  const radioRef = useRef<HTMLAudioElement>(null)
  const {
    setAudioPlayerRef,
    setCurrentDuration,
    setProgress,
    setPlayingState,
    handleSongEnded,
    getCurrentProgress,
  } = usePlayerActions()
  const { currentList, currentSongIndex, radioList } = usePlayerSonglist()
  const isPlaying = usePlayerIsPlaying()
  const mediaType = usePlayerMediaType()
  const loopState = usePlayerLoop()
  const currentDuration = usePlayerDuration()
  const audioPlayerRef = usePlayerRef()
  const progress = getCurrentProgress()
  const { resetSession, radioSession, songSession, playbackState } =
    useMediaSession()
  const { replayGainType, replayGainPreAmp, replayGainDefaultGain } =
    useReplayGainState()

  const song = currentList[currentSongIndex]
  const radio = radioList[currentSongIndex]

  const isSong = mediaType === 'song'
  const isRadio = mediaType === 'radio'

  useEffect(() => {
    if (mediaType !== 'song' && !song) return

    if (audioPlayerRef === null && audioRef.current)
      setAudioPlayerRef(audioRef.current)
  }, [audioPlayerRef, audioRef, mediaType, setAudioPlayerRef, song])

  useEffect(() => {
    if (!song && !radio) resetSession()
  }, [song, radio, resetSession])

  useEffect(() => {
    if (radioList.length > 0 && isRadio) {
      const radio = radioList[currentSongIndex]
      radioSession(radio)
    }
  }, [currentSongIndex, isRadio, radioList, radioSession])

  useEffect(() => {
    if (currentList.length > 0 && isSong) {
      const song = currentList[currentSongIndex]
      songSession(song)
    }
  }, [currentList, currentSongIndex, isSong, songSession])

  useEffect(() => {
    playbackState(isPlaying)
  }, [isPlaying, playbackState])

  const setupProgressListener = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.currentTime = progress
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
  }, [currentDuration, progress, setCurrentDuration, setProgress])

  function getTrackReplayGain(): ReplayGainParams {
    const preAmp = replayGainPreAmp
    const defaultGain = replayGainDefaultGain

    if (!song || !song.replayGain) {
      return { gain: defaultGain, peak: 1, preAmp }
    }

    if (replayGainType === 'album') {
      const { albumGain = defaultGain, albumPeak = 1 } = song.replayGain
      return { gain: albumGain, peak: albumPeak, preAmp }
    }

    const { trackGain = defaultGain, trackPeak = 1 } = song.replayGain
    return { gain: trackGain, peak: trackPeak, preAmp }
  }

  return (
    <footer className="border-t h-[--player-height] w-full flex items-center fixed bottom-0 left-0 right-0 z-40 bg-background">
      <div className="w-full h-full grid grid-cols-player gap-2 px-4">
        {/* Track Info */}
        <div className="flex items-center gap-2 w-full">
          {isSong && <MemoTrackInfo song={song} />}
          {isRadio && <MemoRadioInfo radio={radio} />}
        </div>
        {/* Main Controls */}
        <div className="col-span-2 flex flex-col justify-center items-center px-4 gap-1">
          <MemoPlayerControls song={song} radio={radio} />

          {isSong && <PlayerProgress audioRef={audioRef} song={song} />}
        </div>
        {/* Remain Controls and Volume */}
        <div className="flex items-center w-full justify-end">
          <div className="flex items-center gap-1">
            {isSong && <MemoPlayerLikeButton disabled={!song} />}
            {isSong && <MemoPlayerSongListButton disabled={!song} />}
            {isRadio && <MemoPlayerClearQueueButton disabled={!radio} />}

            <MemoPlayerVolume
              audioRef={isRadio ? radioRef : audioRef}
              disabled={!song && !radio}
            />
          </div>
        </div>
      </div>

      {isSong && song && (
        <AudioPlayer
          replayGain={getTrackReplayGain()}
          src={getSongStreamUrl(song.id)}
          autoPlay={isPlaying}
          audioRef={audioRef}
          loop={loopState === LoopState.One}
          onPlay={() => setPlayingState(true)}
          onPause={() => setPlayingState(false)}
          onLoadedMetadata={setupProgressListener}
          onEnded={handleSongEnded}
          onLoadStart={() => {
            if (audioRef.current) audioRef.current.volume = getVolume() / 100
          }}
          data-testid="player-song-audio"
        />
      )}

      {isRadio && radio && (
        <AudioPlayer
          src={radio.streamUrl}
          autoPlay={isPlaying}
          audioRef={radioRef}
          onPlay={() => setPlayingState(true)}
          onPause={() => setPlayingState(false)}
          onLoadStart={() => {
            if (radioRef.current) radioRef.current.volume = getVolume() / 100
          }}
          data-testid="player-radio-audio"
        />
      )}
    </footer>
  )
}
