import { Play } from 'lucide-react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Link } from 'react-router-dom'
import { getCoverArtUrl } from '@/api/httpClient'
import { Button } from '@/app/components/ui/button'
import { ROUTES } from '@/routes/routesList'
import { ISimilarArtist } from '@/types/responses/artist'

interface ArtistCardProps {
  artist: ISimilarArtist
  onButtonClick: (artist: ISimilarArtist) => void
}

export default function ArtistCard({ artist, onButtonClick }: ArtistCardProps) {
  return (
    <div className="cursor-pointer">
      <Link to={ROUTES.ARTIST.PAGE(artist.id)}>
        <div className="group flex-1 aspect-square rounded bg-border relative overflow-hidden">
          <LazyLoadImage
            src={getCoverArtUrl(artist.coverArt)}
            alt={artist.name}
            effect="opacity"
            width="100%"
            height="100%"
            className="aspect-square object-cover w-full h-full absolute inset-0 z-0"
          />
          <div className="w-full h-full flex items-center justify-center rounded bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300 absolute inset-0 z-10">
            <Button
              className="opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full w-12 h-12 z-20"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                e.preventDefault()
                onButtonClick(artist)
              }}
            >
              <Play className="fill-foreground" />
            </Button>
          </div>
        </div>
      </Link>
      <div className="flex flex-col cursor-default">
        <Link to={ROUTES.ARTIST.PAGE(artist.id)}>
          <p className="leading-7 text-xs text-muted-foreground truncate hover:underline">
            {artist.name}
          </p>
        </Link>
      </div>
    </div>
  )
}
