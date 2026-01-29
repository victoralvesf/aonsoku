import { LazyLoadImage } from 'react-lazy-load-image-component'
import { ImageLoader } from '@/app/components/image-loader'
import { usePlayerCurrentSong } from '@/store/player.store'

export function MiniPlayerSongImage() {
  const song = usePlayerCurrentSong()

  return (
    <div className="min-w-[20%] h-full max-w-full aspect-square flex items-center justify-center rounded">
      <ImageLoader id={song.coverArt} type="song" size={500}>
        {(src) => (
          <LazyLoadImage
            src={src}
            width="100%"
            height="100%"
            loading="eager"
            effect="opacity"
            className="aspect-square object-cover object-center w-full max-w-full bg-skeleton text-transparent rounded shadow-md"
            data-testid="track-image"
            alt={`${song.artist} - ${song.title}`}
          />
        )}
      </ImageLoader>
    </div>
  )
}
