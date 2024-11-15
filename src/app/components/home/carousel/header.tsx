import Autoplay from 'embla-carousel-autoplay'
import { HeaderItem } from '@/app/components/home/carousel/header-item'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/app/components/ui/carousel'
import { ISong } from '@/types/responses/song'

interface HomeHeaderProps {
  songs: ISong[]
}

export default function HomeHeader({ songs }: HomeHeaderProps) {
  if (songs.length === 0) return null

  return (
    <Carousel
      className="w-full border rounded-lg overflow-hidden z-10"
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
      <CarouselContent
        className="ml-0 flex transform-gpu"
        style={{ borderRadius: 'calc(var(--radius) - 2px)' }}
      >
        {songs.map((song, index) => (
          <CarouselItem
            key={song.id}
            className="pl-0 basis-full maskImage-carousel-item"
            data-testid={`carousel-header-song-${index}`}
          >
            <HeaderItem song={song} />
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="absolute right-[4.5rem] bottom-10">
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
