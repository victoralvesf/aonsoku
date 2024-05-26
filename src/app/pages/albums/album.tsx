import { useLoaderData } from "react-router-dom"
import { SingleAlbum } from "@/types/responses/album"
import { convertSecondsToHumanRead } from '@/utils/convertSecondsToTime'
import { DataTable } from '@/app/components/ui/data-table'
import { usePlayer } from '@/app/contexts/player-context'
import { albumSongsColumns } from '@/app/tables/album/songs-columns'
import ImageHeader from '@/app/components/image-header'
import PlayButtons from "@/app/components/play-buttons"
import ListWrapper from "@/app/components/list-wrapper"

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
        badges={badges}
      />

      <ListWrapper>
        <PlayButtons
          playButtonTooltip={`Play ${album.name}`}
          handlePlayButton={() => player.setSongList(album.song, 0)}
          shuffleButtonTooltip={`Play ${album.name} in shuffle mode`}
          handleShuffleButton={() => player.setSongList(album.song, 0, true)}
          optionsTooltip={`More options for ${album.name}`}
          showLikeButton={true}
          likeState={album.starred}
          contentId={album.id}
        />

        <DataTable
          columns={albumSongsColumns}
          data={album.song}
          handlePlaySong={(row) => player.setSongList(album.song, row.index)}
        />
      </ListWrapper>
    </div>
  )
}