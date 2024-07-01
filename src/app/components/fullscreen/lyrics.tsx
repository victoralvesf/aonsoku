import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { usePlayer } from '@/app/contexts/player-context'
import { subsonic } from '@/service/subsonic'

export function LyricsTab() {
  const lyricsBoxRef = useRef<HTMLDivElement>(null)
  const { currentSongIndex, getCurrentSong } = usePlayer()
  const { t } = useTranslation()

  const noLyricsFound = t('fullscreen.noLyrics')

  const [currentLyrics, setCurrentLyrics] = useState(noLyricsFound)

  const getLyrics = useCallback(async () => {
    const song = getCurrentSong()
    const response = await subsonic.songs.getLyrics(song.artist, song.title)

    if (response) {
      setCurrentLyrics(response.value || noLyricsFound)
    }
  }, [getCurrentSong, noLyricsFound])

  useEffect(() => {
    getLyrics()
  }, [currentSongIndex, getLyrics])

  useEffect(() => {
    if (lyricsBoxRef.current) {
      lyricsBoxRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, [currentSongIndex])

  const lines = currentLyrics.split('\n')

  return (
    <div
      className="text-center font-semibold text-xl 2xl:text-2xl px-2"
      ref={lyricsBoxRef}
    >
      {lines.map((line, index) => (
        <p key={index} className="leading-10">
          {line}
        </p>
      ))}
    </div>
  )
}
