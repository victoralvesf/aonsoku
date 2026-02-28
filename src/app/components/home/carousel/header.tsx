import Autoplay from 'embla-carousel-autoplay'
import { HeaderFallback } from '@/app/components/fallbacks/home-fallbacks'
import { HeaderItem } from '@/app/components/home/carousel/header-item'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/app/components/ui/carousel'
import { useGetRandomSongs } from '@/app/hooks/use-home'

export function HomeHeader() {
  const { data: songs, isLoading, isFetching } = useGetRandomSongs()

  if (isLoading || isFetching) return <HeaderFallback />

  if (!songs || songs.length === 0) return null

  return (
    <Carousel
      className="w-full overflow-hidden z-10"
      opts={{
        loop: true,
      }}
      plugins={[
        Autoplay({
          delay: 10000,
        }),
      ]}
      data-testid="header-carousel"
    >
      <CarouselContent className="ml-0 flex">
        {songs.map((song, index) => (
          <CarouselItem
            key={song.id}
            className="pl-0 basis-full maskImage-carousel-item transform-gpu"
            data-testid={`carousel-header-song-${index}`}
          >
            <HeaderItem song={song} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="absolute right-[5rem] bottom-10">
        <CarouselPrevious
          data-testid="header-carousel-previous"
          className="-left-6 shadow-sm"
        />
        <CarouselNext
          data-testid="header-carousel-next"
          className="shadow-sm"
        />
      </div>
    </Carousel>
  )
}
