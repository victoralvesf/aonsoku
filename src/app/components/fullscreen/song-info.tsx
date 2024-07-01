import { getCoverArtUrl } from '@/api/httpClient'
import { MarqueeTitle } from '@/app/components/fullscreen/marquee-title'
import { Badge } from '@/app/components/ui/badge'
import { usePlayer } from '@/app/contexts/player-context'

export function SongInfo() {
  const player = usePlayer()
  const song = player.getCurrentSong()
  const imageUrl = getCoverArtUrl(song.coverArt, '1000')

  const backgroundImage = `url(${imageUrl})`

  return (
    <div className="flex items-end justify-start h-full min-h-full gap-6 flex-1 2xl:py-16">
      <div
        className="max-w-[1000px] h-full bg-contain bg-center aspect-square rounded-lg 2xl:rounded-2xl"
        style={{ backgroundImage }}
      />

      <div className="text-left w-full max-w-full overflow-hidden">
        <MarqueeTitle spacing="high">
          <h2 className="scroll-m-20 text-4xl 2xl:text-5xl font-bold tracking-tight py-3">
            {song.title}
          </h2>
        </MarqueeTitle>
        <p className="leading-7 text-lg 2xl:text-xl text-foreground/70 truncate -mt-1">
          {song.artist} {'•'} {song.album}
        </p>
        <div className="flex gap-2 mt-2 2xl:mt-3">
          <Badge>{song.suffix.toUpperCase()}</Badge>
          {song.genre && <Badge>{song.genre}</Badge>}
          <Badge>{song.year}</Badge>
        </div>
      </div>
    </div>
  )
}
