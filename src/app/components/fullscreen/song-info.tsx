import { LazyLoadImage } from 'react-lazy-load-image-component'
import { getCoverArtUrl } from '@/api/httpClient'
import { MarqueeTitle } from '@/app/components/fullscreen/marquee-title'
import { AspectRatio } from '@/app/components/ui/aspect-ratio'
import { Badge } from '@/app/components/ui/badge'
import { usePlayerStore } from '@/store/player.store'

export function SongInfo() {
  const currentSong = usePlayerStore((state) => state.songlist.currentSong)
  const imageUrl = getCoverArtUrl(currentSong.coverArt, 'song', '800')

  return (
    <div className="flex items-center justify-start h-full min-h-full max-h-full gap-4 2xl:gap-6 flex-1 pt-2 overflow-hidden">
      <div className="2xl:w-[33%] h-full max-w-[450px] max-h-[450px] 2xl:max-w-[550px] 2xl:max-h-[550px] items-end flex aspect-square">
        <AspectRatio ratio={1 / 1}>
          <LazyLoadImage
            src={imageUrl}
            effect="opacity"
            alt={`${currentSong.artist} - ${currentSong.title}`}
            className="rounded-lg 2xl:rounded-2xl aspect-square object-cover shadow-custom-5"
            width="100%"
            height="100%"
          />
        </AspectRatio>
      </div>

      <div className="flex flex-col w-[66%] max-w-full h-full max-h-[450px] 2xl:max-h-[550px] justify-end text-left overflow-hidden">
        <MarqueeTitle gap="mr-6">
          <h2 className="scroll-m-20 text-4xl 2xl:text-5xl font-bold tracking-tight py-3 drop-shadow-lg">
            {currentSong.title}
          </h2>
        </MarqueeTitle>
        <p className="leading-7 text-lg 2xl:text-xl text-foreground/70 truncate drop-shadow-lg">
          {currentSong.artist} {'•'} {currentSong.album}
        </p>
        <div className="flex gap-2 mt-2 2xl:mt-3">
          {currentSong.genre && (
            <Badge variant="neutral">{currentSong.genre}</Badge>
          )}
          {currentSong.year && (
            <Badge variant="neutral">{currentSong.year}</Badge>
          )}
        </div>
      </div>
    </div>
  )
}
