import { LazyLoadImage } from 'react-lazy-load-image-component'
import { cn } from '@/lib/utils'
import { CoverArt } from '@/types/coverArtType'
import { ImageLoader } from '../image-loader'

interface CoverImageProps {
  coverArt: string
  coverArtType: CoverArt
  coverArtSize?: number
  size?: number
  altText: string
}

export function CoverImage({
  coverArt,
  coverArtType,
  coverArtSize = 80,
  size = 40,
  altText,
}: CoverImageProps) {
  function setSizes() {
    return [
      `w-[${size}px] h-[${size}px]`,
      `max-w-[${size}px] max-h-[${size}px]`,
      `min-w-[${size}px] min-h-[${size}px]`,
    ].join(' ')
  }

  return (
    <div
      className={cn(
        'bg-skeleton overflow-hidden rounded shadow aspect-square',
        setSizes(),
      )}
    >
      <ImageLoader id={coverArt} type={coverArtType} size={coverArtSize}>
        {(src) => (
          <LazyLoadImage
            src={src}
            alt={altText}
            effect="opacity"
            width={size}
            height={size}
            className="aspect-square object-cover bg-center"
          />
        )}
      </ImageLoader>
    </div>
  )
}
