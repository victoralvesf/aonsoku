import { FastAverageColor, FastAverageColorResult } from 'fast-average-color'
import { getCoverArtUrl } from "@/api/httpClient"
import { SingleAlbum } from "@/types/responses/album"
import { Suspense, useRef, useState } from "react"
import { useLoaderData } from "react-router-dom"
import { cn } from '@/lib/utils'
import { convertSecondsToHumanRead } from '@/utils/convertSecondsToTime'
import { Badge } from '@/app/components/ui/badge'
import { DataTable } from '@/app/components/ui/data-table'
import { usePlayer } from '@/app/contexts/player-context'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'
import { Button } from '@/app/components/ui/button'
import { EllipsisVertical, Play, Shuffle } from 'lucide-react'
import { albumSongsColumns } from '@/app/tables/album/songs-columns'

const bgGradient = "bg-gradient-to-b from-white/50 to-white/50 dark:from-black/50 dark:to-black/50"

function HeaderFallback() {
  return (
    <div className={cn("w-full p-6 bg-muted-foreground", bgGradient)}>
      <div className="h-[250px] w-full bg-transparent"></div>
    </div>
  )
}

export default function Album() {
  const fac = new FastAverageColor();
  const player = usePlayer()
  const album = useLoaderData() as SingleAlbum
  const imageRef = useRef<HTMLImageElement>(null)
  const [albumColor, setAlbumColor] = useState<FastAverageColorResult>()

  console.log(album)

  async function handleLoadImage() {
    const img = imageRef.current
    const color = await fac.getColorAsync(img, {
      algorithm: 'dominant',
      ignoredColor: [
        [255, 255, 255, 255, 90], // White
        [0, 0, 0, 255, 30], // Black
        [0, 0, 0, 0, 40], // Transparent
      ],
      mode: 'precision',
    })

    setAlbumColor(color)
  }

  return (
    <div className="w-full">
      <Suspense fallback={<HeaderFallback />}>
        <div
          className={cn("w-full px-4 py-6 lg:px-8 flex gap-4", bgGradient)}
          style={{ backgroundColor: albumColor?.hex }}
        >
          <img
            crossOrigin="anonymous"
            ref={imageRef}
            src={getCoverArtUrl(album.coverArt, '350')}
            alt={album.name}
            className="rounded shadow-lg"
            width={250}
            height={250}
            onLoad={handleLoadImage}
          />

          <div className="flex flex-col justify-end">
            <p className="text-sm mb-2">
              Album
            </p>
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-2">
              {album.name}
            </h1>
            <h4 className="scroll-m-20 text-lg font-medium tracking-tight opacity-60">
              {album.artist}
            </h4>

            <div className="flex gap-2 mt-2">
              <Badge variant="secondary">
                {album.year}
              </Badge>
              {album.genre && (
                <Badge variant="secondary">
                  {album.genre}
                </Badge>
              )}
              <Badge variant="secondary">
                {album.songCount} songs
              </Badge>
              <Badge variant="secondary">
                {convertSecondsToHumanRead(album.duration, true)}
              </Badge>
            </div>
          </div>
        </div>
      </Suspense>

      <div className="w-full px-4 py-6 lg:px-8 pt-0">
        <div className="w-full mb-6 mt-6 flex items-center gap-4">
          <SimpleTooltip text={`Play ${album.name}`}>
            <Button
              className="rounded-full w-14 h-14 hover:scale-[0.97] transform-gpu"
              variant="default"
              onClick={() => player.setSongList(album.song, 0)}
            >
              <Play className="w-4 h-4 fill-slate-50 text-slate-50" strokeWidth={6} />
            </Button>
          </SimpleTooltip>

          <SimpleTooltip text={`Play ${album.name} in shuffle mode`}>
            <Button
              className="rounded-full w-12 h-12"
              variant="ghost"
              onClick={() => player.setSongList(album.song, 0, true)}
            >
              <Shuffle className="w-4 h-4" strokeWidth={3} />
            </Button>
          </SimpleTooltip>

          <SimpleTooltip text={`More options for ${album.name}`}>
            <Button className="rounded-full w-12 h-12" variant="ghost">
              <EllipsisVertical className="w-4 h-4" strokeWidth={3} />
            </Button>
          </SimpleTooltip>
        </div>

        <DataTable
          columns={albumSongsColumns}
          data={album.song}
          handlePlaySong={(row) => player.setSongList(album.song, row.index)}
        />
      </div>
    </div>
  )
}