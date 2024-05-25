import { Albums } from "@/types/responses/album";
import { getCoverArtUrl } from "@/api/httpClient";
import { Button } from "../ui/button";
import { Play } from "lucide-react";
import { usePlayer } from "@/app/contexts/player-context";
import { subsonic } from "@/service/subsonic";
import { Link } from "react-router-dom";
import { Carousel, CarouselContent, CarouselItem } from "../ui/carousel";
import HomeSongCard from "./song-card";

interface PreviewListProps {
  list: Albums[]
  title: string
  moreRoute: string
}

export default function PreviewList({ list, title, moreRoute }: PreviewListProps) {
  const player = usePlayer()

  async function handlePlayAlbum(album: Albums) {
    const response = await subsonic.albums.getOne(album.id)

    if (response) {
      player.setSongList(response.song, 0)
    }
  }

  const halfSize = list.length / 2
  const leftSide = [...list].slice(0, halfSize)
  const rightSide = [...list].slice(halfSize)

  return (
    <div className="w-full flex flex-col mb-4">
      <div className="my-4 flex justify-between items-center">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          {title}
        </h3>
        <div>
          <Link to={moreRoute}>
            <p className="leading-7 text-sm truncate hover:underline text-muted-foreground hover:text-primary">
              See more
            </p>
          </Link>
        </div>
      </div>

      <div className="flex w-full">
        <Carousel className="w-full">
          <CarouselContent className="ml-0 flex">
            <CarouselItem className="pl-0 basis-full flex gap-4 pr-4">
              {leftSide.map((album) => (
                <HomeSongCard
                  key={album.id}
                  album={album}
                  onButtonClick={(album) => handlePlayAlbum(album)}
                />
              ))}
            </CarouselItem>
            <CarouselItem className="pl-0 basis-full flex gap-4">
              {rightSide.map((album) => (
                <HomeSongCard
                  key={album.id}
                  album={album}
                  onButtonClick={(album) => handlePlayAlbum(album)}
                />
              ))}
            </CarouselItem>
          </CarouselContent>
        </Carousel>
        {/* {list.map((album) => (
          <div key={album.id} className="basis-1/8 flex-1 min-w-0 grow-0">
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
                        handlePlayAlbum(album)
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
        ))} */}
      </div>
    </div>
  )
}

