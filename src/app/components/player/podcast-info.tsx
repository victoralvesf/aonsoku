import { Fragment } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Link } from 'react-router-dom'
import { ROUTES } from '@/routes/routesList'
import { EpisodeWithPodcast } from '@/types/responses/podcasts'
import { MarqueeTitle } from '../fullscreen/marquee-title'

export function PodcastInfo({ podcast }: { podcast: EpisodeWithPodcast }) {
  return (
    <Fragment>
      <div className="min-w-[70px] max-w-[70px] aspect-square bg-cover bg-center bg-skeleton rounded overflow-hidden shadow-md">
        <LazyLoadImage
          src={podcast.image_url}
          width="100%"
          height="100%"
          className="aspect-square object-cover w-full h-full text-transparent"
          data-testid="podcast-image"
          alt={podcast.title}
        />
      </div>
      <div className="flex flex-col justify-center">
        <MarqueeTitle gap="mr-2">
          <Link to={ROUTES.EPISODES.PAGE(podcast.id)}>
            <span
              className="text-sm font-medium hover:underline cursor-pointer"
              data-testid="podcast-episode-title"
            >
              {podcast.title}
            </span>
          </Link>
        </MarqueeTitle>
        <Link
          to={ROUTES.PODCASTS.PAGE(podcast.podcast_id)}
          className="w-fit inline-flex"
          data-testid="track-artist-url"
        >
          <span className="text-xs font-regular text-muted-foreground hover:underline">
            {podcast.podcast.title}
          </span>
        </Link>
      </div>
    </Fragment>
  )
}
