import { useQuery } from '@tanstack/react-query'
import { act, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ScrollArea,
  scrollAreaViewportSelector,
} from '@/app/components/ui/scroll-area'
import { subsonic } from '@/service/subsonic'
import { usePlayerSonglist, usePlayerProgress, usePlayerRef } from '@/store/player.store'
import { Lrc, useRecoverAutoScrollImmediately } from 'react-lrc';
import { ILyric } from '@/types/responses/song'

interface LyricProps {
  lyrics: ILyric
}

export function LyricsTab() {
  const { currentSong } = usePlayerSonglist()
  const { t } = useTranslation()

  const { artist, title } = currentSong

  const { data: lyrics, isLoading } = useQuery({
    queryKey: ['get-lyrics', artist, title],
    queryFn: () =>
      subsonic.songs.getLyrics({
        artist,
        title,
      }),
  })


  const noLyricsFound = t('fullscreen.noLyrics')
  const loadingLyrics = t('fullscreen.loadingLyrics')

  if (isLoading) {
    return <p className="leading-10 drop-shadow-lg">{loadingLyrics}</p>
  }
  else if (lyrics && lyrics.value) {
    return <AutoLyrics lyrics={lyrics}></AutoLyrics>
  }
  else {
    return <p className="leading-10 drop-shadow-lg">{noLyricsFound}</p>
  }

}

// Chooses between synced and unsynced based on the contents of the lyric text
function AutoLyrics({ lyrics }: LyricProps) {
  // TODO: better method of detecting lrc files
  return (lyrics!.value?.trim().includes("[00:")) ? <SyncedLyrics lyrics={lyrics}/> : <UnsyncedLyrics lyrics={lyrics}/>
}

function SyncedLyrics({ lyrics }: LyricProps) {

  const playerRef = usePlayerRef()
  const [progress, setProgress] = useState(0)

  setTimeout(() => setProgress((playerRef?.currentTime || 0) * 1000), 50)

  return (
    <>
      <div
        className="h-full overflow-y-auto text-center font-semibold text-3xl 2xl:text-2xl px-2 scroll-smooth lrc-box"
      >
          <Lrc
            lrc={lyrics.value!}
            recoverAutoScrollInterval={1500}
            currentMillisecond={progress}
            className="max-h-full"
            lineRenderer={({ active, line: { content } }) => (
              <p style={{ opacity: active ? 1 : 0.7 }} className="leading-20 drop-shadow-lg my-3 transition-opacity">{content}</p>
            )}
          />
      </div>
    </>
  )
}

function UnsyncedLyrics({ lyrics }: LyricProps) {

  const { currentSong } = usePlayerSonglist()
  const lyricsBoxRef = useRef<HTMLDivElement>(null)

  let lines = lyrics.value!.split('\n')

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
      className="h-full overflow-y-auto text-center font-semibold text-xl 2xl:text-2xl px-2 scroll-smooth"
      ref={lyricsBoxRef}
    >
      {
        lines.map((line, index) => (
          <p key={index} className="leading-10 drop-shadow-lg">
            {line}
          </p>
        ))
      }
    </ScrollArea>
  )
}