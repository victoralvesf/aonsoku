import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Albums } from "@/types/responses/album";
import { usePlayer } from "@/app/contexts/player-context";
import { subsonic } from "@/service/subsonic";
import { Carousel, type CarouselApi, CarouselContent, CarouselItem } from "@/app/components/ui/carousel";
import HomeSongCard from "@/app/components/home/song-card";
import { CarouselButton } from "@/app/components/ui/carousel-button";

interface PreviewListProps {
  list: Albums[]
  title: string
  showMore?: boolean
  moreTitle?: string
  moreRoute: string
}

export default function PreviewList({
  list,
  title,
  showMore = true,
  moreTitle = 'See more',
  moreRoute,
}: PreviewListProps) {
  const [api, setApi] = useState<CarouselApi>()
  const [canScrollPrev, setCanScrollPrev] = useState<boolean>()
  const [canScrollNext, setCanScrollNext] = useState<boolean>()
  let split = true

  const player = usePlayer()

  if (list.length <= 8) split = false

  if (list.length > 16) {
    list = list.slice(0, 16)
  }

  async function handlePlayAlbum(album: Albums) {
    const response = await subsonic.albums.getOne(album.id)

    if (response) {
      player.setSongList(response.song, 0)
    }
  }

  const leftSide = split ? [...list].slice(0, 8) : []
  const rightSide = split ? [...list].slice(8) : []

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
          {showMore && (
            <Link to={moreRoute}>
              <p className="leading-7 text-sm truncate hover:underline text-muted-foreground hover:text-primary">
                {moreTitle}
              </p>
            </Link>
          )}
          {split && (
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
          )}
        </div>
      </div>

      <div className="flex w-full">
        <Carousel className="w-full" setApi={setApi}>
          <CarouselContent className="flex">
            {split ? (
              <>
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
              </>
            ) : (
              <CarouselItem className="basis-full flex gap-4">
                {list.map((album) => (
                  <HomeSongCard
                    key={album.id}
                    album={album}
                    onButtonClick={(album) => handlePlayAlbum(album)}
                  />
                ))}
              </CarouselItem>
            )}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  )
}

