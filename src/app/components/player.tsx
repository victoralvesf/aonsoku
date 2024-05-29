import { useEffect, useRef, useState } from "react"
import {
  AudioLines,
  Heart,
  ListVideo,
  Maximize2,
  Pause,
  Play,
  Repeat,
  Shuffle,
  SkipBack,
  SkipForward,
  Volume2
} from "lucide-react"
import { Link } from "react-router-dom"
import clsx from "clsx"

import { getCoverArtUrl, getSongStreamUrl } from "@/api/httpClient"
import Image from "@/app/components/image"
import { Slider } from "@/app/components/ui/slider"
import { Button } from "@/app/components/ui/button"
import { usePlayer } from "@/app/contexts/player-context"
import { convertSecondsToTime } from "@/utils/convertSecondsToTime"
import { subsonic } from "@/service/subsonic"
import HandlePressedKeys from "@/app/components/handle-pressed-keys"
import { cn } from "@/lib/utils"
import FullscreenMode from "@/app/components/fullscreen/page"
import { SimpleTooltip } from "./ui/simple-tooltip"

let isSeeking = false

export function Player() {
  const player = usePlayer()
  const audioRef = useRef<HTMLAudioElement>(null)
  const [progress, setProgress] = useState(0)
  const [currentDuration, setCurrentDuration] = useState(0)
  const [volume, setVolume] = useState(100)

  const song = player.currentSongList[player.currentSongIndex]

  useEffect(() => {
    if (!audioRef.current) return

    player.isPlaying ? audioRef.current.play() : audioRef.current.pause()
  }, [player.isPlaying])

  useEffect(() => {
    if (!audioRef.current) return

    audioRef.current.volume = volume / 100
  }, [volume])

  function setupProgressListener() {
    audioRef.current!.currentTime = 0

    const audioDuration = parseInt(audioRef.current!.duration.toFixed())

    if (currentDuration !== audioDuration) {
      setCurrentDuration(audioDuration)
    }

    audioRef.current!.addEventListener('timeupdate', () => {
      if (!isSeeking) {
        setProgress(Math.floor(audioRef.current!.currentTime))
      }
    })
  }

  function handleSongEnded() {
    if (player.hasNextSong) {
      player.playNextSong()
    } else {
      player.clearPlayerState()
    }
  }

  function handleStartedSeeking() {
    isSeeking = true
  }

  function handleSeeking(amount: number) {
    isSeeking = true
    setProgress(amount)
  }

  function handleSeeked(amount: number) {
    isSeeking = false

    audioRef.current!.currentTime = amount
    setProgress(amount)
  }

  function handleChangeVolume(volume: number) {
    setVolume(volume)
  }

  async function handleLikeButton() {
    await subsonic.star.handleStarItem(song.id, player.isSongStarred)
    player.setIsSongStarred(!player.isSongStarred)
  }

  return (
    <div className="border-t h-[100px] w-full flex items-center">
      <div className="w-full h-full grid grid-cols-player gap-2 px-4">
        {/* Track Info */}
        <div className="flex items-center gap-2">
          {song ? (
            <>
              <div className="group relative">
                <Image src={getCoverArtUrl(song.coverArt, "140")} width={70} className="rounded shadow-md" />
                <FullscreenMode>
                  <Button variant="secondary" size="icon" className="cursor-pointer w-8 h-8 shadow-md rounded-full opacity-0 group-hover:opacity-100 transition-opacity ease-in-out absolute top-1 right-1">
                    <SimpleTooltip text="Switch to Fullscreen">
                      <div className="w-full h-full flex items-center justify-center">
                        <Maximize2 className="w-4 h-4" />
                      </div>
                    </SimpleTooltip>
                  </Button>
                </FullscreenMode>
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-sm font-medium">{song.title}</span>
                <Link to={`/library/artists/${song.artistId}`} className={cn(!song.artistId && "pointer-events-none")}>
                  <span
                    className={cn("text-xs font-light text-muted-foreground", song.artistId && "hover:underline")}
                  >
                    {song.artist}
                  </span>
                </Link>
              </div>
            </>
          ) : (
            <>
              <div className="w-[60px] h-[60px] flex justify-center items-center bg-muted rounded">
                <AudioLines />
              </div>
              <div className="flex flex-col justify-center">
                <span className="text-sm font-medium">No song playing</span>
              </div>
            </>
          )}
        </div>
        {/* Main Controls */}
        <div className="col-span-2 flex flex-col justify-center items-center px-4 gap-1">
          <div className="flex w-full gap-1 justify-center items-center">
            <Button
              variant="ghost"
              className="rounded-full w-10 h-10 p-3"
              disabled={!song || player.isPlayingOneSong}
              onClick={player.toggleShuffle}
            >
              <Shuffle className={clsx("w-10 h-10", player.isShuffleActive && "text-primary")} />
            </Button>
            <Button
              variant="ghost"
              className="rounded-full w-10 h-10 p-3"
              disabled={!song || !player.hasPrevSong}
              onClick={player.playPrevSong}
            >
              <SkipBack className="w-10 h-10" />
            </Button>

            <Button
              className="rounded-full w-10 h-10 p-3"
              disabled={!song}
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
              disabled={!song || !player.hasNextSong}
              onClick={player.playNextSong}
            >
              <SkipForward className="w-10 h-10" />
            </Button>
            <Button
              variant="ghost"
              className="rounded-full w-10 h-10 p-3"
              disabled={!song}
              onClick={player.toggleLoop}
            >
              <Repeat className={clsx("w-10 h-10", player.isLoopActive && "text-primary")} />
            </Button>
          </div>

          <div className="flex w-full gap-2 justify-center items-center">
            <small className="text-xs text-muted-foreground">
              {convertSecondsToTime(progress)}
            </small>
            {song ? (
              <Slider
                defaultValue={[0]}
                value={[progress]}
                max={currentDuration}
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
            <small className="text-xs text-muted-foreground">
              {convertSecondsToTime(currentDuration ?? 0)}
            </small>
          </div>
        </div>
        {/* Remain Controls and Volume */}
        <div className="flex items-center w-full justify-end">
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              className="rounded-full w-10 h-10 p-3"
              disabled={!song}
              onClick={handleLikeButton}
            >
              <Heart className={clsx("w-5 h-5", player.isSongStarred && "text-red-500 fill-red-500")} />
            </Button>

            <Button
              variant="ghost"
              className="rounded-full w-10 h-10 p-2"
              disabled={!song}
            >
              <ListVideo className="w-4 h-4" />
            </Button>

            <div className="flex gap-2 ml-2">
              <Volume2
                className={clsx("w-4 h-4", !song && "opacity-50")}
              />
              <Slider
                defaultValue={[100]}
                value={[volume]}
                max={100}
                step={1}
                disabled={!song}
                className={clsx("cursor-pointer", "w-[8rem]", !song && "pointer-events-none opacity-50")}
                onValueChange={([value]) => handleChangeVolume(value)}
              />
            </div>
          </div>
        </div>
      </div>

      {song && (
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

      <HandlePressedKeys />
    </div>
  )
}