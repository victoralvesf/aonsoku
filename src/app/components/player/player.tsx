import { useEffect, useRef, useState, useCallback, memo } from "react"
import {
  Heart,
  ListVideo,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2
} from "lucide-react"
import clsx from "clsx"
import { useHotkeys } from "react-hotkeys-hook"

import { getSongStreamUrl } from "@/api/httpClient"
import { Slider } from "@/app/components/ui/slider"
import { Button } from "@/app/components/ui/button"
import { usePlayer } from "@/app/contexts/player-context"
import { convertSecondsToTime } from "@/utils/convertSecondsToTime"
import { subsonic } from "@/service/subsonic"
import { TrackInfo } from "@/app/components/player/track-info"
import { RadioInfo } from "@/app/components/player/radio-info"

let isSeeking = false

const MemoizedTrackInfo = memo(TrackInfo)
const MemoizedRadioInfo = memo(RadioInfo)

export function Player() {
  const player = usePlayer()
  const audioRef = useRef<HTMLAudioElement>(null)
  const [volume, setVolume] = useState(100)

  const song = player.currentSongList[player.currentSongIndex]
  const radio = player.radioList[player.currentSongIndex]

  useHotkeys('space', () => {
    if (player.currentSongList.length > 0) {
      player.togglePlayPause()
    }
  }, { preventDefault: true })

  useEffect(() => {
    if (!audioRef.current) return

    if (player.mediaType === 'radio') {
      if (player.isPlaying) {
        audioRef.current.src = ''
        audioRef.current.src = radio.streamUrl
        audioRef.current.play()
      } else {
        audioRef.current.pause()
      }
    }

    if (player.mediaType === 'song') {
      player.isPlaying ? audioRef.current.play() : audioRef.current.pause()
    }
  }, [player.isPlaying])

  useEffect(() => {
    if (!audioRef.current) return

    audioRef.current.volume = volume / 100
  }, [volume])

  const setupProgressListener = useCallback(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.currentTime = 0
    const audioDuration = Math.floor(audio.duration)

    if (player.currentDuration !== audioDuration) {
      player.setCurrentDuration(audioDuration)
    }

    const handleTimeUpdate = () => {
      if (!isSeeking) {
        player.setProgress(Math.floor(audio.currentTime))
      }
    }

    audio.addEventListener('timeupdate', handleTimeUpdate)
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate)
    }
  }, [player])

  const handleSongEnded = useCallback(() => {
    if (player.hasNextSong) {
      player.playNextSong()
    } else {
      player.clearPlayerState()
    }
  }, [player])

  const handleStartedSeeking = useCallback(() => {
    isSeeking = true
  }, [])

  const handleSeeking = useCallback((amount: number) => {
    isSeeking = true
    player.setProgress(amount)
  }, [player])

  const handleSeeked = useCallback((amount: number) => {
    isSeeking = false
    if (audioRef.current) {
      audioRef.current.currentTime = amount
      player.setProgress(amount)
    }
  }, [player])

  const handleChangeVolume = useCallback((volume: number) => {
    setVolume(volume)
  }, [])

  const handleLikeButton = useCallback(async () => {
    await subsonic.star.handleStarItem(song.id, player.isSongStarred)
    player.setIsSongStarred(!player.isSongStarred)
  }, [song, player])

  return (
    <div className="border-t h-[100px] w-full flex items-center">
      <div className="w-full h-full grid grid-cols-player gap-2 px-4">
        {/* Track Info */}
        <div className="flex items-center gap-2">
          {player.mediaType === 'song' && (
            <MemoizedTrackInfo song={song} />
          )}
          {player.mediaType === 'radio' && (
            <MemoizedRadioInfo radio={radio} />
          )}
        </div>
        {/* Main Controls */}
        <div className="col-span-2 flex flex-col justify-center items-center px-4 gap-1">
          <div className="flex w-full gap-1 justify-center items-center">
            {player.mediaType === 'song' && (
              <Button
                variant="ghost"
                className="rounded-full w-10 h-10 p-3"
                disabled={!song || player.isPlayingOneSong}
                onClick={player.toggleShuffle}
              >
                <Shuffle className={clsx("w-10 h-10", player.isShuffleActive && "text-primary")} />
              </Button>
            )}

            <Button
              variant="ghost"
              className="rounded-full w-10 h-10 p-3"
              disabled={(!song && !radio) || !player.hasPrevSong}
              onClick={player.playPrevSong}
            >
              <SkipBack className="w-10 h-10" />
            </Button>

            <Button
              className="rounded-full w-10 h-10 p-3"
              disabled={!song && !radio}
              onClick={player.togglePlayPause}
            >
              {player.isPlaying ? (
                <Pause className="w-10 h-10 fill-slate-50 text-slate-50" />
              ) : (
                <Play className="w-10 h-10 fill-slate-50 text-slate-50" />
              )}
            </Button>

            <Button
              variant="ghost"
              className="rounded-full w-10 h-10 p-3"
              disabled={(!song && !radio) || !player.hasNextSong}
              onClick={player.playNextSong}
            >
              <SkipForward className="w-10 h-10" />
            </Button>

            {player.mediaType === 'song' && (
              <Button
                variant="ghost"
                className="rounded-full w-10 h-10 p-3"
                disabled={!song}
                onClick={player.toggleLoop}
              >
                <Repeat className={clsx("w-10 h-10", player.isLoopActive && "text-primary")} />
              </Button>
            )}
          </div>

          {player.mediaType === 'song' && (
            <div className="flex w-full gap-2 justify-center items-center">
              <small className="text-xs text-muted-foreground w-10 text-center">
                {convertSecondsToTime(player.progress)}
              </small>
              {song ? (
                <Slider
                  defaultValue={[0]}
                  value={[player.progress]}
                  max={player.currentDuration}
                  step={1}
                  className="cursor-pointer w-[32rem]"
                  thumbmousedown={() => handleStartedSeeking()}
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
              <small className="text-xs text-muted-foreground w-10 text-center">
                {convertSecondsToTime(player.currentDuration ?? 0)}
              </small>
            </div>
          )}
        </div>
        {/* Remain Controls and Volume */}
        <div className="flex items-center w-full justify-end">
          <div className="flex items-center gap-1">
            {player.mediaType === 'song' && (
              <Button
                variant="ghost"
                className="rounded-full w-10 h-10 p-3"
                disabled={!song}
                onClick={handleLikeButton}
              >
                <Heart className={clsx("w-5 h-5", player.isSongStarred && "text-red-500 fill-red-500")} />
              </Button>
            )}

            {player.mediaType === 'song' && (
              <Button
                variant="ghost"
                className="rounded-full w-10 h-10 p-2"
                disabled={!song}
              >
                <ListVideo className="w-4 h-4" />
              </Button>
            )}

            <div className="flex gap-2 ml-2">
              <Volume2
                className={clsx("w-4 h-4", !song && !radio && "opacity-50")}
              />
              <Slider
                defaultValue={[100]}
                value={[volume]}
                max={100}
                step={1}
                disabled={!song && !radio}
                className={clsx("cursor-pointer", "w-[8rem]", !song && !radio && "pointer-events-none opacity-50")}
                onValueChange={([value]) => handleChangeVolume(value)}
              />
            </div>
          </div>
        </div>
      </div>

      {player.mediaType === 'song' && song && (
        <audio
          src={getSongStreamUrl(song.id)}
          autoPlay
          ref={audioRef}
          loop={player.isLoopActive}
          onPlay={() => player.setPlayingState(true)}
          onPause={() => player.setPlayingState(false)}
          onLoadedMetadata={setupProgressListener}
          onEnded={handleSongEnded}
        />
      )}

      {player.mediaType === 'radio' && radio && (
        <audio
          src={radio.streamUrl}
          autoPlay
          ref={audioRef}
          onPlay={() => player.setPlayingState(true)}
          onPause={() => player.setPlayingState(false)}
        />
      )}
    </div>
  )
}
