import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { subsonic } from '@/service/subsonic'
import { usePlayerSonglist } from '@/store/player.store'

export function LyricsTab() {
  const lyricsBoxRef = useRef<HTMLDivElement>(null)
  const { currentSongIndex, currentSong } = usePlayerSonglist()
  const { t } = useTranslation()

  const noLyricsFound = t('fullscreen.noLyrics')

  const [currentLyrics, setCurrentLyrics] = useState(noLyricsFound)

  const getLyrics = useCallback(async () => {
    const response = await subsonic.songs.getLyrics(
      currentSong.artist,
      currentSong.title,
    )

    if (response) {
      setCurrentLyrics(response.value || noLyricsFound)
    }
  }, [currentSong, noLyricsFound])

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
        <p key={index} className="leading-10 drop-shadow-lg">
          {line}
        </p>
      ))}
    </div>
  )
}
