import { ISong } from "@/types/responses/song";
import Autoplay from "embla-carousel-autoplay"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious
} from "@/app/components/ui/carousel"
import { getCoverArtUrl } from "@/api/httpClient";
import { Badge } from "../ui/badge";
import { convertSecondsToTime } from "@/utils/convertSecondsToTime";
import { Button } from "../ui/button";
import { Play } from "lucide-react";
import { usePlayer } from "@/app/contexts/player-context";
import { subsonic } from "@/service/subsonic";

interface HomeHeaderProps {
  songs: ISong[]
}

export default function HomeHeader({ songs }: HomeHeaderProps) {
  const player = usePlayer()

  async function handlePlaySongAlbum(song: ISong) {
    const album = await subsonic.albums.getOne(song.albumId)

    if (album?.song) {
      const songIndex = album?.song.findIndex((item) => item.id === song.id)

      player.setSongList(album?.song, songIndex)
    }
  }

  return (
    <Carousel
      className="w-full border rounded-lg z-10"
      opts={{
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 10000
        })
      ]}
    >
      <CarouselContent className="ml-0 flex transform-gpu" style={{ borderRadius: 'calc(var(--radius) - 2px)' }}>
        {songs.map((song) => (
          <CarouselItem key={song.id} className="pl-0 basis-full">
            <div className="w-full bg-cover bg-center" style={{ backgroundImage: `url(${getCoverArtUrl(song.id, '500')})` }}>
              <div className="w-full flex-1 h-full inset-0 backdrop-blur-xl bg-gradient-to-b from-white/30 to-white/80 dark:from-black/30 dark:to-black/80">
                <div className="flex h-[300px] p-6 gap-6">
                  <div className="min-w-[252px] w-[252px] min-h-[252px] h-[252px] group">
                    <div
                      className="group flex-1 aspect-square rounded bg-cover bg-center"
                      style={{ backgroundImage: `url(${getCoverArtUrl(song.coverArt)})` }}
                    >
                      <div className="w-full h-full flex items-center justify-center rounded bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-300">
                        <Button
                          className="opacity-0 group-hover:opacity-100 transition-all duration-300 rounded-full w-14 h-14"
                          variant="outline"
                          onClick={() => handlePlaySongAlbum(song)}
                        >
                          <Play className="fill-foreground" />
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div className="flex min-h-[252px] h-[252px] flex-col justify-end">
                    <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-2">
                      {song.title}
                    </h1>
                    <h4 className="scroll-m-20 text-xl font-semibold tracking-tight opacity-60">
                      {song.artist}
                    </h4>
                    <div className="flex gap-2 mt-2">
                      {song.genre !== undefined && (
                        <Badge variant="secondary" className="border">{song.genre}</Badge>
                      )}
                      {song.year && (
                        <Badge variant="secondary" className="border">{song.year}</Badge>
                      )}
                      <Badge variant="secondary" className="border">
                        {convertSecondsToTime(song.duration)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="absolute right-[4.5rem] bottom-10">
        <CarouselPrevious className="-left-6 shadow-sm" />
        <CarouselNext className="shadow-sm" />
      </div>
    </Carousel>
  )
}
