import { useLoaderData } from "react-router-dom"
import { SingleAlbum } from "@/types/responses/album"
import { convertSecondsToHumanRead } from '@/utils/convertSecondsToTime'
import { DataTable } from '@/app/components/ui/data-table'
import { usePlayer } from '@/app/contexts/player-context'
import { songsColumns } from '@/app/tables/songs-columns'
import ImageHeader from '@/app/components/album/image-header'
import PlayButtons from "@/app/components/album/play-buttons"
import ListWrapper from "@/app/components/list-wrapper"
import { ColumnFilter } from "@/types/columnFilter"

export default function Album() {
  const player = usePlayer()
  const album = useLoaderData() as SingleAlbum

  const badges = [
    album.year || null,
    album.genre || null,
    album.songCount ? `${album.songCount} songs` : null,
    album.duration ? convertSecondsToHumanRead(album.duration, true) : null,
  ]

  const columnsToShow: ColumnFilter[] = [
    'index',
    'title',
    'artist',
    'duration',
    'playCount',
    'played',
    'bitRate',
    'contentType',
    'starred'
  ]

  return (
    <div className="w-full">
      <ImageHeader
        type="Album"
        title={album.name}
        subtitle={album.artist}
        artistId={album.artistId}
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
          columns={songsColumns}
          data={album.song}
          handlePlaySong={(row) => player.setSongList(album.song, row.index)}
          columnFilter={columnsToShow}
        />
      </ListWrapper>
    </div>
  )
}