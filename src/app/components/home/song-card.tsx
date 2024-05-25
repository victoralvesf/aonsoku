import { Albums } from "@/types/responses/album"
import { Button } from "../ui/button"
import { Link } from "react-router-dom"
import { getCoverArtUrl } from "@/api/httpClient"
import { Play } from "lucide-react"

interface HomeSongCardProps {
  album: Albums,
  onButtonClick: (album: Albums) => void
}

export default function HomeSongCard({ album, onButtonClick }: HomeSongCardProps) {
  return (
    <div className="basis-1/8 flex-1 min-w-0 grow-0">
      <div className="cursor-pointer">
        <Link to={`/album/${album.id}`}>
          <div
            className="group flex-1 aspect-square rounded bg-cover bg-center"
            style={{ backgroundImage: `url(${getCoverArtUrl(album.coverArt, '220')})` }}
          >
            <div className="w-full h-full flex items-center justify-center rounded bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300">
              <Button
                className="opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full w-14 h-14 z-20"
                variant="secondary"
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
          <Link to={`/album/${album.id}`}>
            <p className="leading-7 text-sm font-semibold truncate hover:underline">
              {album.title}
            </p>
          </Link>
          <Link to={`/artist/${album.artistId}`}>
            <p className="truncate text-xs text-muted-foreground -mt-1 hover:underline">
              {album.artist}
            </p>
          </Link>
        </div>
      </div>
    </div>
  )
}