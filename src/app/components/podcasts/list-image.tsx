import { useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Podcast } from '@/types/responses/podcasts'

interface ListImageProps {
  podcast: Podcast
}

const placeholderSrc = '/default_podcast_art.png'

export function PodcastListImage({ podcast }: ListImageProps) {
  const [imageSrc, setImageSrc] = useState(podcast.image_url)

  const handleError = () => {
    setImageSrc(placeholderSrc)
  }

  return (
    <LazyLoadImage
      src={imageSrc}
      alt={podcast.title}
      effect="opacity"
      width="100%"
      height="100%"
      className="aspect-square object-cover w-full h-full absolute inset-0 z-0"
      data-testid="podcast-card-image"
      onError={handleError}
    />
  )
}
