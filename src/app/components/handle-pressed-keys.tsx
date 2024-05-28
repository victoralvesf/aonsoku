import { useEffect, useRef } from "react"
import { usePlayer } from "@/app/contexts/player-context"

export default function HandlePressedKeys() {
  const player = usePlayer()
  const togglePlayPauseRef = useRef(player.togglePlayPause)
  const currentSongListRef = useRef(player.currentSongList)

  useEffect(() => {
    togglePlayPauseRef.current = player.togglePlayPause
  }, [player.togglePlayPause])

  useEffect(() => {
    currentSongListRef.current = player.currentSongList
  }, [player.currentSongList])

  useEffect(() => {
    function handleKeyPress(event: KeyboardEvent) {
      if (event.code === 'Space') {
        const { tagName, contentEditable } = document.activeElement as HTMLElement;

        const isNotInput = !['INPUT', 'TEXTAREA'].includes(tagName)
        const isNotContentEditable = contentEditable !== "true"

        if (isNotInput && isNotContentEditable) {
          event.preventDefault()
          if (currentSongListRef.current.length > 0) {
            togglePlayPauseRef.current()
          }
        }
      }
    }

    window.addEventListener('keydown', handleKeyPress)

    return () => {
      window.removeEventListener('keydown', handleKeyPress)
    }
  }, [])

  return <></>
}