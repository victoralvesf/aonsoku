import { useEffect, useRef } from 'react'
import { usePlayer } from '@/app/contexts/player-context'

export function LyricsTab({ text }: { text: string }) {
  const lines = text.split('\n')
  const lyricsBoxRef = useRef<HTMLDivElement>(null)
  const { currentSongIndex } = usePlayer()

  useEffect(() => {
    if (lyricsBoxRef.current) {
      lyricsBoxRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, [currentSongIndex])

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
