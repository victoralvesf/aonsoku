import { LazyLoadImage } from 'react-lazy-load-image-component'
import { getCoverArtUrl } from '@/api/httpClient'
import { cn } from '@/lib/utils'

interface CoverImageProps {
  coverArt: string
  coverArtSize?: number
  size?: number
  altText: string
}

export function CoverImage({
  coverArt,
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
        'bg-skeleton overflow-hidden rounded shadow-md aspect-square',
        setSizes(),
      )}
    >
      <LazyLoadImage
        src={getCoverArtUrl(coverArt, coverArtSize.toString())}
        alt={altText}
        effect="opacity"
        width={size}
        height={size}
        className="aspect-square object-cover"
      />
    </div>
  )
}
