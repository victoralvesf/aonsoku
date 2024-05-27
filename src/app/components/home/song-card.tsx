import { Link } from "react-router-dom"
import { Play } from "lucide-react"
import { Albums } from "@/types/responses/album"
import { Button } from "@/app/components/ui/button"
import { getCoverArtUrl } from "@/api/httpClient"

interface HomeSongCardProps {
  album: Albums,
  onButtonClick: (album: Albums) => void
}

export default function HomeSongCard({ album, onButtonClick }: HomeSongCardProps) {
  return (
    <div className="basis-1/8 flex-1 min-w-0 grow-0">
      <div className="cursor-pointer">
        <Link to={`/library/albums/${album.id}`}>
          <div
            className="group flex-1 aspect-square rounded bg-cover bg-center"
            style={{ backgroundImage: `url(${getCoverArtUrl(album.coverArt, '250')})` }}
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
          <Link to={`/library/albums/${album.id}`}>
            <p className="leading-7 text-sm font-semibold truncate hover:underline">
              {album.title}
            </p>
          </Link>
          <Link to={`/library/artists/${album.artistId}`}>
            <p className="truncate text-xs text-muted-foreground -mt-1 hover:underline">
              {album.artist}
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}