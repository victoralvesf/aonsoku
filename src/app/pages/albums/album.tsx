import { Suspense } from "react"
import { Await, useLoaderData } from "react-router-dom"
import { Albums, AlbumsListData, IAlbumInfo, SingleAlbum } from "@/types/responses/album"
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
import AlbumInfo, { AlbumInfoFallback } from "@/app/components/album/album-info"
import { ROUTES } from "@/routes/routesList"
import { useTranslation } from "react-i18next"

interface ILoaderData {
  album: SingleAlbum
  artistAlbums: Promise<Search>
  albumInfo: Promise<IAlbumInfo>
  randomGenreAlbums?: Promise<AlbumsListData>
}

export default function Album() {
  const player = usePlayer()
  const { t } = useTranslation()
  const { album, artistAlbums, albumInfo, randomGenreAlbums } = useLoaderData() as ILoaderData

  const albumDuration = album.duration ? convertSecondsToHumanRead(album.duration, true) : null

  const badges = [
    album.year || null,
    album.genre || null,
    album.songCount ? t('playlist.songCount', { count: album.songCount }) : null,
    albumDuration ? t('playlist.duration', { duration: albumDuration }) : null,
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

  const buttonsTooltips = {
    play: t('playlist.buttons.play', { name: album.name }),
    shuffle: t('playlist.buttons.shuffle', { name: album.name }),
    options: t('playlist.buttons.options', { name: album.name })
  }

  return (
    <div className="w-full">
      <ImageHeader
        type={t('album.headline')}
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
          playButtonTooltip={buttonsTooltips.play}
          handlePlayButton={() => player.setSongList(album.song, 0)}
          shuffleButtonTooltip={buttonsTooltips.shuffle}
          handleShuffleButton={() => player.setSongList(album.song, 0, true)}
          optionsTooltip={buttonsTooltips.options}
          showLikeButton={true}
          likeTooltipResource={album.name}
          likeState={album.starred}
          contentId={album.id}
        />

        <div className="mb-6">
          <Suspense fallback={<AlbumInfoFallback />}>
            <Await resolve={albumInfo} errorElement={<></>}>
              <AlbumInfo albumName={album.name} />
            </Await>
          </Suspense>
        </div>

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
                    title={t('album.more.listTitle')}
                    moreTitle={t('album.more.discography')}
                    moreRoute={ROUTES.ARTIST.ALBUMS(album.artistId)}
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
                children={({ list }: AlbumsListData) => (
                  <PreviewList
                    list={list}
                    showMore={false}
                    title={t('album.more.genreTitle', { genre: album.genre })}
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