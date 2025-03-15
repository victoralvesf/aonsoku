import { LazyLoadImage } from 'react-lazy-load-image-component'
import { getCoverArtUrl } from '@/api/httpClient'
import { usePlayerCurrentSong } from '@/store/player.store'

export function MiniPlayerSongImage() {
  const song = usePlayerCurrentSong()

  return (
    <div className="min-w-[50%] h-full max-w-full aspect-square flex items-center justify-center rounded shadow-lg">
      <LazyLoadImage
        src={getCoverArtUrl(song.coverArt, 'song', '300')}
        width="100%"
        height="100%"
        loading="eager"
        className="aspect-square object-cover object-center w-full max-w-full bg-skeleton text-transparent rounded"
        data-testid="track-image"
        alt={`${song.artist} - ${song.title}`}
      />
    </div>
  )
}
