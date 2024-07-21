import { Play } from 'lucide-react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Link } from 'react-router-dom'
import { getCoverArtUrl } from '@/api/httpClient'
import { Button } from '@/app/components/ui/button'
import { ROUTES } from '@/routes/routesList'
import { Albums } from '@/types/responses/album'

interface HomeSongCardProps {
  album: Albums
  coverArtSize?: number
  onButtonClick: (album: Albums) => void
}

export default function HomeSongCard({
  album,
  coverArtSize = 250,
  onButtonClick,
}: HomeSongCardProps) {
  return (
    <div className="cursor-pointer">
      <Link to={ROUTES.ALBUM.PAGE(album.id)}>
        <div className="group flex-1 aspect-square rounded bg-border relative overflow-hidden">
          <LazyLoadImage
            src={getCoverArtUrl(album.coverArt, coverArtSize.toString())}
            alt={album.name}
            effect="opacity"
            width="100%"
            height="100%"
            className="aspect-square object-cover w-full h-full absolute inset-0 z-0"
            data-testid="song-card-image"
          />
          <div className="w-full h-full flex items-center justify-center rounded bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 absolute inset-0 z-10">
            <Button
              className="opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full w-12 h-12 z-20"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                onButtonClick(album)
              }}
            >
              <Play className="fill-foreground" />
            </Button>
          </div>
        </div>
      </Link>
      <div className="flex flex-col cursor-default">
        <Link to={ROUTES.ALBUM.PAGE(album.id)}>
          <p
            className="leading-7 text-sm font-semibold truncate hover:underline"
            data-testid="song-card-album-title"
          >
            {album.title}
          </p>
        </Link>
        {!album.artistId ? (
          <p
            className="truncate text-xs text-muted-foreground -mt-1"
            data-testid="song-card-artist"
          >
            {album.artist}
          </p>
        ) : (
          <Link
            to={ROUTES.ARTIST.PAGE(album.artistId)}
            data-testid="song-card-artist-link"
          >
            <p
              className="truncate text-xs text-muted-foreground -mt-1 hover:underline"
              data-testid="song-card-artist"
            >
              {album.artist}
            </p>
          </Link>
        )}
      </div>
    </div>
  )
}
