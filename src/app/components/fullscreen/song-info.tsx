import { MarqueeTitle } from '@/app/components/fullscreen/marquee-title'
import { ISong } from '@/types/responses/song'
import { Badge } from '../ui/badge'

interface SongInfoProps {
  imageUrl: string
  song: ISong
}

export function SongInfo({ imageUrl, song }: SongInfoProps) {
  const backgroundImage = `url(${imageUrl})`

  return (
    <div className="flex flex-col items-center px-4">
      <div
        className="w-[50%] 2xl:w-[65%] max-w-[550px] bg-contain bg-center aspect-square rounded-2xl shadow-lg shadows-4 shadow-opacity-5 shadow-y-[3px] shadows-scale-3"
        style={{ backgroundImage }}
      />

      <div className="w-full text-left space-y-1 mt-6">
        <MarqueeTitle>
          <h2 className="scroll-m-20 text-xl 2xl:text-3xl font-bold tracking-tight">
            {song.title}
          </h2>
        </MarqueeTitle>
        <p className="leading-7 text-base 2xl:text-lg text-foreground/70 truncate">
          {song.artist} {'•'} {song.album}
        </p>
        <div className="flex gap-2 mt-1">
          <Badge variant="secondary">{song.suffix.toUpperCase()}</Badge>
          {song.genre && <Badge variant="secondary">{song.genre}</Badge>}
          <Badge variant="secondary">{song.year}</Badge>
        </div>
      </div>
    </div>
  )
}
