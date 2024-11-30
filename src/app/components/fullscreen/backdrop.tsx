import { getCoverArtUrl } from '@/api/httpClient'
import { usePlayerCurrentSong } from '@/store/player.store'

export default function FullscreenBackdrop() {
  const currentSong = usePlayerCurrentSong()
  const coverArtUrl = getCoverArtUrl(currentSong.coverArt, 'song', '600')
  const backgroundImage = `url(${coverArtUrl})`

  return (
    <div className="absolute inset-0 w-full h-full z-0">
      <div className="relative w-full h-full bg-black/60">
        <div
          className="absolute -inset-20 bg-cover bg-center z-0"
          style={{ backgroundImage, filter: 'blur(54px)' }}
        />
      </div>
    </div>
  )
}
