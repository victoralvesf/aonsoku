import { useLoaderData } from "react-router-dom"
import { EllipsisVertical, Play, Shuffle } from 'lucide-react'
import { SingleAlbum } from "@/types/responses/album"
import { convertSecondsToHumanRead } from '@/utils/convertSecondsToTime'
import { Badge } from '@/app/components/ui/badge'
import { DataTable } from '@/app/components/ui/data-table'
import { usePlayer } from '@/app/contexts/player-context'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'
import { Button } from '@/app/components/ui/button'
import { albumSongsColumns } from '@/app/tables/album/songs-columns'
import ImageHeader from '@/app/components/image-header'

export default function Album() {
  const player = usePlayer()
  const album = useLoaderData() as SingleAlbum

  const badges = [
    album.year || null,
    album.genre || null,
    album.songCount ? `${album.songCount} songs` : null,
    album.duration ? convertSecondsToHumanRead(album.duration, true) : null,
  ]

  return (
    <div className="w-full">
      <ImageHeader
        type="Album"
        title={album.name}
        subtitle={album.artist}
        coverArtId={album.coverArt}
        coverArtSize="350"
        coverArtAlt={album.name}
      >
        <>
          {badges.map((badge) => (
            <>
              {badge !== null && <Badge variant="secondary">{badge}</Badge>}
            </>
          ))}
        </>
      </ImageHeader>

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