import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Lrc } from 'react-lrc'
import {
  ScrollArea,
  scrollAreaViewportSelector,
} from '@/app/components/ui/scroll-area'
import { subsonic } from '@/service/subsonic'
import { usePlayerSonglist, usePlayerRef } from '@/store/player.store'
import { ILyric } from '@/types/responses/song'
import { isSafari } from '@/utils/osType'

interface LyricProps {
  lyrics: ILyric
}

export function LyricsTab() {
  const { currentSong } = usePlayerSonglist()
  const { t } = useTranslation()

  const { artist, title, duration } = currentSong

  const { data: lyrics, isLoading } = useQuery({
    queryKey: ['get-lyrics', artist, title, duration],
    queryFn: () =>
      subsonic.lyrics.getLyrics({
        artist,
        title,
        duration,
      }),
  })

  const noLyricsFound = t('fullscreen.noLyrics')
  const loadingLyrics = t('fullscreen.loadingLyrics')

  if (isLoading) {
    return <UnsyncedLyrics lyrics={{ value: loadingLyrics }} />
  } else if (lyrics && lyrics.value) {
    return areLyricsSynced(lyrics) ? (
      <SyncedLyrics lyrics={lyrics} />
    ) : (
      <UnsyncedLyrics lyrics={lyrics} />
    )
  } else {
    return <UnsyncedLyrics lyrics={{ value: noLyricsFound }} />
  }
}

function SyncedLyrics({ lyrics }: LyricProps) {
  const playerRef = usePlayerRef()
  const [progress, setProgress] = useState(0)

  setTimeout(() => {
    let newProgress = (playerRef?.currentTime || 0) * 1000

    if (newProgress === progress) {
      newProgress += 1 // Prevents the lyrics from getting stuck when the audio is still loading
    }

    setProgress(newProgress)
  }, 50)

  const skipToTime = (timeMs: number) => {
    if (playerRef) {
      playerRef!.currentTime = timeMs / 1000
    }
  }

  return (
    <div className="w-full h-full text-center font-semibold text-2xl 2xl:text-3xl px-2 lrc-box maskImage-big-player-lyrics">
      <Lrc
        lrc={lyrics.value!}
        recoverAutoScrollInterval={1500}
        currentMillisecond={progress}
        id="sync-lyrics-box"
        className={clsx('h-full overflow-y-auto', !isSafari && 'scroll-smooth')}
        verticalSpace={true}
        lineRenderer={({ active, line }) => (
          <p
            onClick={() => skipToTime(line.startMillisecond)}
            className={clsx(
              'drop-shadow-lg my-5 cursor-pointer hover:opacity-100 duration-500',
              'transition-[opacity,transform] motion-reduce:transition-none',
              active ? 'opacity-100 scale-125' : 'opacity-50',
            )}
          >
            {line.content}
          </p>
        )}
      />
    </div>
  )
}

function UnsyncedLyrics({ lyrics }: LyricProps) {
  const { currentSong } = usePlayerSonglist()
  const lyricsBoxRef = useRef<HTMLDivElement>(null)

  const lines = lyrics.value!.split('\n')

  useEffect(() => {
    if (lyricsBoxRef.current) {
      const scrollArea = lyricsBoxRef.current.querySelector(
        scrollAreaViewportSelector,
      ) as HTMLDivElement

      scrollArea.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }, [currentSong])

  return (
    <ScrollArea
      className="w-full h-full overflow-y-auto text-center font-semibold text-xl 2xl:text-2xl px-2 scroll-smooth"
      ref={lyricsBoxRef}
    >
      {lines.map((line, index) => (
        <p key={index} className="leading-10 drop-shadow-lg">
          {line}
        </p>
      ))}
    </ScrollArea>
  )
}

function areLyricsSynced(lyrics: ILyric) {
  // Most LRC files start with the string "[00:" or "[01:" indicating synced lyrics
  const lyric = lyrics.value?.trim() ?? ''
  return (
    lyric.startsWith('[00:') ||
    lyric.startsWith('[01:') ||
    lyric.startsWith('[02:')
  )
}
