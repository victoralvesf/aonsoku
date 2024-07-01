import { Play } from 'lucide-react'
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
        <div
          className="group flex-1 aspect-square rounded bg-cover bg-center bg-border"
          style={{
            backgroundImage: `url(${getCoverArtUrl(album.coverArt, coverArtSize.toString())})`,
          }}
        >
          <div className="w-full h-full flex items-center justify-center rounded bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300">
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
          <p className="leading-7 text-sm font-semibold truncate hover:underline">
            {album.title}
          </p>
        </Link>
        <Link to={ROUTES.ARTIST.PAGE(album.artistId)}>
          <p className="truncate text-xs text-muted-foreground -mt-1 hover:underline">
            {album.artist}
          </p>
        </Link>
      </div>
    </div>
  )
}
