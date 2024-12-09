import { useQuery } from '@tanstack/react-query'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import {
  ScrollArea,
  scrollAreaViewportSelector,
} from '@/app/components/ui/scroll-area'
import { subsonic } from '@/service/subsonic'
import { usePlayerSonglist } from '@/store/player.store'

export function LyricsTab() {
  const lyricsBoxRef = useRef<HTMLDivElement>(null)
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

  const noLyricsFound = t('fullscreen.noLyrics')
  const loadingLyrics = t('fullscreen.loadingLyrics')

  let lines = [noLyricsFound]

  if (lyrics && lyrics.value) {
    lines = lyrics.value.split('\n')
  }

  return (
    <ScrollArea
      className="h-full overflow-y-auto text-center font-semibold text-xl 2xl:text-2xl px-2 scroll-smooth"
      ref={lyricsBoxRef}
    >
      {isLoading && (
        <p className="leading-10 drop-shadow-lg">{loadingLyrics}</p>
      )}
      {!isLoading &&
        lines.map((line, index) => (
          <p key={index} className="leading-10 drop-shadow-lg">
            {line}
          </p>
        ))}
    </ScrollArea>
  )
}
