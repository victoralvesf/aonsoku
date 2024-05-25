import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/app/components/ui/carousel"

import { Albums } from "@/types/responses/album";
import { getCoverArtUrl } from "@/api/httpClient";
import { Button } from "../ui/button";
import { Play } from "lucide-react";
import { usePlayer } from "@/app/contexts/player-context";
import { subsonic } from "@/service/subsonic";

interface RecentlyAddedPreviewProps {
  recentlyAdded: Albums[]
}

export default function RecentlyAddedPreview({ recentlyAdded }: RecentlyAddedPreviewProps) {
  const player = usePlayer()

  async function handlePlayAlbum(album: Albums) {
    const response = await subsonic.albums.getOne(album.id)

    if (response) {
      player.setSongList(response.song, 0)
    }
  }

  return (
    <Carousel className="w-full flex flex-col">
      <div className="my-4 flex justify-between">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          Recently Added
        </h3>
        <div className="relative w-32">
          <CarouselPrevious className="absolute top-4 left-14" />
          <CarouselNext className="absolute top-4 right-0" />
        </div>
      </div>

      <CarouselContent className="transform-gpu">
        {recentlyAdded.map((album) => (
          <CarouselItem key={album.id} className="basis-1/8">
            <div className="cursor-pointer">
              <div
                className="group flex-1 aspect-square rounded bg-cover bg-center"
                style={{ backgroundImage: `url(${getCoverArtUrl(album.coverArt, '220')})` }}
              >
                <div className="w-full h-full flex items-center justify-center rounded bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300">
                  <Button
                    className="opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full w-14 h-14"
                    variant="secondary"
                    onClick={() => handlePlayAlbum(album)}
                  >
                    <Play className="fill-foreground" />
                  </Button>
                </div>
              </div>
              <div className="flex flex-col">
                <p className="leading-7 text-sm font-semibold truncate">{album.title}</p>
                <p className="truncate text-xs text-muted-foreground">{album.artist}</p>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  )
}

