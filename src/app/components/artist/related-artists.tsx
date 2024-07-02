import { useEffect, useState } from 'react'
import { useAsyncValue } from 'react-router-dom'
import ArtistCard from '@/app/components/artist/artist-card'
import {
  Carousel,
  type CarouselApi,
  CarouselContent,
  CarouselItem,
} from '@/app/components/ui/carousel'
import { CarouselButton } from '@/app/components/ui/carousel-button'
import { useSongList } from '@/app/hooks/use-song-list'
import { usePlayerActions } from '@/store/player.store'
import { IArtistInfo, ISimilarArtist } from '@/types/responses/artist'

interface RelatedArtistsListProps {
  title: string
}

export default function RelatedArtistsList({ title }: RelatedArtistsListProps) {
  const data = useAsyncValue() as IArtistInfo
  const { getArtistAllSongs } = useSongList()
  let list = data.similarArtist!

  const [api, setApi] = useState<CarouselApi>()
  const [canScrollPrev, setCanScrollPrev] = useState<boolean>()
  const [canScrollNext, setCanScrollNext] = useState<boolean>()
  const { setSongList } = usePlayerActions()

  if (list.length > 16) {
    list = list.slice(0, 16)
  }

  async function handlePlayArtistRadio(artist: ISimilarArtist) {
    const songList = await getArtistAllSongs(artist.name)
    if (songList) setSongList(songList, 0)
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

      <div className="transform-gpu">
        <Carousel
          opts={{
            align: 'start',
            slidesToScroll: 'auto',
          }}
          setApi={setApi}
        >
          <CarouselContent>
            {list.map((artist) => (
              <CarouselItem key={artist.id} className="basis-1/8">
                <ArtistCard
                  artist={artist}
                  onButtonClick={(artist) => handlePlayArtistRadio(artist)}
                />
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </div>
  )
}
