import { Albums } from "@/types/responses/album";
import { usePlayer } from "@/app/contexts/player-context";
import { subsonic } from "@/service/subsonic";
import { Link } from "react-router-dom";
import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from "../ui/carousel";
import HomeSongCard from "./song-card";
import { useEffect, useState } from "react";
import { CarouselButton } from "../ui/carousel-button";

interface PreviewListProps {
  list: Albums[]
  title: string
  moreRoute: string
}

export default function PreviewList({ list, title, moreRoute }: PreviewListProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [canScrollPrev, setCanScrollPrev] = useState<boolean>()
  const [canScrollNext, setCanScrollNext] = useState<boolean>()

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

  useEffect(() => {
    if (!api) {
      return
    }

    setCanScrollPrev(api.canScrollPrev())
    setCanScrollNext(api.canScrollNext())

    api.on('select', () => {
      setCanScrollPrev(api.canScrollPrev())
      setCanScrollNext(api.canScrollNext())
    })
  }, [api])

  return (
    <div className="w-full flex flex-col mb-4">
      <div className="my-4 flex justify-between items-center">
        <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
          {title}
        </h3>
        <div className="flex items-center gap-4">
          <Link to={moreRoute}>
            <p className="leading-7 text-sm truncate hover:underline text-muted-foreground hover:text-primary">
              See more
            </p>
          </Link>
          <div className="flex gap-2">
            <CarouselButton
              direction="prev"
              disabled={!canScrollPrev}
              onClick={() => api?.scrollPrev()}
            />
            <CarouselButton
              direction="next"
              disabled={!canScrollNext}
              onClick={() => api?.scrollNext()}
            />
          </div>
        </div>
      </div>

      <div className="flex w-full">
        <Carousel className="w-full" setApi={setApi}>
          <CarouselContent className="flex">
            <CarouselItem className="basis-full flex gap-4">
              {leftSide.map((album) => (
                <HomeSongCard
                  key={album.id}
                  album={album}
                  onButtonClick={(album) => handlePlayAlbum(album)}
                />
              ))}
            </CarouselItem>
            <CarouselItem className="basis-full flex gap-4">
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
      </div>
    </div>
  )
}

