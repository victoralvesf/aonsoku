import { getCoverArtUrl } from '@/api/httpClient'
import { MarqueeTitle } from '@/app/components/fullscreen/marquee-title'
import { AspectRatio } from '@/app/components/ui/aspect-ratio'
import { Badge } from '@/app/components/ui/badge'
import { usePlayerStore } from '@/store/player.store'

export function SongInfo() {
  const currentSong = usePlayerStore((state) => state.songlist.currentSong)
  const imageUrl = getCoverArtUrl(currentSong.coverArt, '1000')

  return (
    <div className="flex items-center justify-start h-full min-h-full max-h-full gap-4 2xl:gap-6 flex-1 pt-2">
      <div className="2xl:w-[33%] h-full max-w-[450px] max-h-[450px] 2xl:max-w-[550px] 2xl:max-h-[550px] items-end flex aspect-square">
        <AspectRatio ratio={1 / 1}>
          <img
            src={imageUrl}
            alt={`${currentSong.artist} - ${currentSong.title}`}
            className="rounded-lg 2xl:rounded-2xl aspect-square"
          />
        </AspectRatio>
      </div>

      <div className="flex flex-col w-[66%] max-w-full h-full max-h-[450px] 2xl:max-h-[550px] justify-end text-left overflow-hidden">
        <MarqueeTitle>
          <h2 className="scroll-m-20 text-4xl 2xl:text-5xl font-bold tracking-tight py-3 drop-shadow-lg">
            {currentSong.title}
          </h2>
        </MarqueeTitle>
        <p className="leading-7 text-lg 2xl:text-xl text-foreground/70 truncate -mt-1 drop-shadow-lg">
          {currentSong.artist} {'•'} {currentSong.album}
        </p>
        <div className="flex gap-2 mt-2 2xl:mt-3">
          <Badge>{currentSong.suffix.toUpperCase()}</Badge>
          {currentSong.genre && <Badge>{currentSong.genre}</Badge>}
          <Badge>{currentSong.year}</Badge>
        </div>
      </div>
    </div>
  )
}
