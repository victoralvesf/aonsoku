import { ReactNode } from 'react'
import { getCoverArtUrl } from '@/api/httpClient'
import { usePlayerSonglist } from '@/store/player.store'

interface FullscreenBackdropProps {
  children: ReactNode
}

export default function FullscreenBackdrop({
  children,
}: FullscreenBackdropProps) {
  const { currentSong } = usePlayerSonglist()
  const coverArtUrl = getCoverArtUrl(currentSong.coverArt, 'song', '1000')
  const backgroundImage = `url(${coverArtUrl})`

  return (
    <div
      className="w-full h-full bg-cover bg-center backdrop-blur shadow-inner bg-foreground"
      style={{ backgroundImage }}
    >
      <div className="w-full flex-1 h-full inset-0 bg-background/40 backdrop-blur-3xl supports-[backdrop-filter]:bg-background/40">
        {children}
      </div>
    </div>
  )
}
