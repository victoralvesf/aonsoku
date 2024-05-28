import { Suspense } from "react"
import { Await, useLoaderData } from "react-router-dom"
import { Albums, SingleAlbum } from "@/types/responses/album"
import { convertSecondsToHumanRead } from '@/utils/convertSecondsToTime'
import { DataTable } from '@/app/components/ui/data-table'
import { usePlayer } from '@/app/contexts/player-context'
import { songsColumns } from '@/app/tables/songs-columns'
import ImageHeader from '@/app/components/album/image-header'
import PlayButtons from "@/app/components/album/play-buttons"
import ListWrapper from "@/app/components/list-wrapper"
import { ColumnFilter } from "@/types/columnFilter"
import { Search } from "@/types/responses/search"
import PreviewList from "@/app/components/home/preview-list"
import PreviewListFallback from "@/app/components/preview-list-fallback"

interface ILoaderData {
  album: SingleAlbum
  artistAlbums: Promise<Search>
  randomGenreAlbums?: Promise<Albums[]>
}

export default function Album() {
  const player = usePlayer()
  const { album, artistAlbums, randomGenreAlbums } = useLoaderData() as ILoaderData

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

  function formatMoreFromArtist(moreAlbums: Albums[]) {
    let list = moreAlbums.filter(item => item.id !== album.id)

    if (list.length > 16) list = list.slice(0, 16)

    return list
  }

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
          likeTooltipResource={album.name}
          likeState={album.starred}
          contentId={album.id}
        />

        <DataTable
          columns={songsColumns}
          data={album.song}
          handlePlaySong={(row) => player.setSongList(album.song, row.index)}
          columnFilter={columnsToShow}
        />

        <div className="mt-4">
          <Suspense fallback={<PreviewListFallback />}>
            <Await
              resolve={artistAlbums}
              errorElement={<></>}
              children={(result: Search) => {
                const list = formatMoreFromArtist(result.album!)
                if (list.length === 0) return <></>
                return (
                  <PreviewList
                    list={list}
                    showMore={true}
                    title="More from this artist"
                    moreTitle="Artist Discography"
                    moreRoute={`/library/albums/artist/${album.artistId}`}
                  />
                )
              }}
            />
          </Suspense>

          {randomGenreAlbums && (
            <Suspense fallback={<PreviewListFallback />}>
              <Await
                resolve={randomGenreAlbums}
                errorElement={<></>}
                children={(result: Albums[]) => (
                  <PreviewList
                    list={result}
                    showMore={false}
                    title={`More from ${album.genre}`}
                  />
                )}
              />
            </Suspense>
          )}
        </div>
      </ListWrapper>
    </div>
  )
}