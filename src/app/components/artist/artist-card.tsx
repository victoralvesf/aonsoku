import { Link } from "react-router-dom"
import { Play } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { getCoverArtUrl } from "@/api/httpClient"
import { ISimilarArtist } from "@/types/responses/artist"

interface ArtistCardProps {
  artist: ISimilarArtist,
  onButtonClick: (artist: ISimilarArtist) => void
}

export default function ArtistCard({ artist, onButtonClick }: ArtistCardProps) {
  return (
    <div className="cursor-pointer">
      <Link to={`/library/artists/${artist.id}`}>
        <div
          className="group flex-1 aspect-square rounded bg-cover bg-center"
          style={{ backgroundImage: `url(${getCoverArtUrl(artist.coverArt, '250')})` }}
        >
          <div className="w-full h-full flex items-center justify-center rounded bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300">
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
        <Link to={`/library/artists/${artist.id}`}>
          <p className="leading-7 text-xs text-muted-foreground truncate hover:underline">
            {artist.name}
          </p>
        </Link>
      </div>
    </div>
  )
}