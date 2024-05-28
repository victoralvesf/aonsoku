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
  moreRoute?: string
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
  const player = usePlayer()

  if (list.length > 16) {
    list = list.slice(0, 16)
  }

  async function handlePlayAlbum(album: Albums) {
    const response = await subsonic.albums.getOne(album.id)

    if (response) {
      player.setSongList(response.song, 0)
    }
  }

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
          {showMore && moreRoute && (
            <Link to={moreRoute}>
              <p className="leading-7 text-sm truncate hover:underline text-muted-foreground hover:text-primary">
                {moreTitle}
              </p>
            </Link>
          )}
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

      <div className="transform-gpu">
        <Carousel
          opts={{
            align: 'start',
            slidesToScroll: 'auto',
          }}
          setApi={setApi}
        >
          <CarouselContent>
            {list.map((album) => (
              <CarouselItem key={album.id} className="basis-1/8">
                <HomeSongCard
                  album={album}
                  onButtonClick={(album) => handlePlayAlbum(album)}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  )
}

