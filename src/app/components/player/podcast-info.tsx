import { Fragment, memo, useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Link } from 'react-router-dom'
import { MarqueeTitle } from '@/app/components/fullscreen/marquee-title'
import { ROUTES } from '@/routes/routesList'
import { EpisodeWithPodcast } from '@/types/responses/podcasts'

const placeholderImageSrc = '/default_podcast_art.png'

const MemoLazyLoadImage = memo(LazyLoadImage)
const MemoMarqueeTitle = memo(MarqueeTitle)

export function PodcastInfo({ podcast }: { podcast: EpisodeWithPodcast }) {
  const [imageError, setImageError] = useState(false)

  return (
    <Fragment>
      <div className="min-w-[70px] max-w-[70px] aspect-square bg-cover bg-center bg-skeleton rounded overflow-hidden shadow-md">
        <MemoLazyLoadImage
          src={imageError ? placeholderImageSrc : podcast.image_url}
          width="100%"
          height="100%"
          className="aspect-square object-cover w-full h-full text-transparent"
          data-testid="podcast-image"
          alt={podcast.title}
          onError={() => setImageError(true)}
        />
      </div>
      <div className="flex flex-col justify-center w-full overflow-hidden">
        <MemoMarqueeTitle gap="mr-2">
          <Link to={ROUTES.EPISODES.PAGE(podcast.id)}>
            <span
              className="text-sm font-medium hover:underline cursor-pointer"
              data-testid="podcast-episode-title"
            >
              {podcast.title}
            </span>
          </Link>
        </MemoMarqueeTitle>
        <Link
          to={ROUTES.PODCASTS.PAGE(podcast.podcast_id)}
          className="w-fit inline-flex max-w-full"
          data-testid="podcast-title"
        >
          <span className="text-xs font-regular text-muted-foreground hover:underline max-w-full truncate">
            {podcast.podcast.title}
          </span>
        </Link>
      </div>
    </Fragment>
  )
}
