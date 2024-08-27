import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { AlbumButtons } from '@/app/components/album/buttons'
import ImageHeader from '@/app/components/album/image-header'
import InfoPanel, { InfoPanelFallback } from '@/app/components/album/info-panel'
import { AlbumFallback } from '@/app/components/fallbacks/album-fallbacks'
import { PreviewListFallback } from '@/app/components/fallbacks/home-fallbacks'
import PreviewList from '@/app/components/home/preview-list'
import ListWrapper from '@/app/components/list-wrapper'
import { DataTable } from '@/app/components/ui/data-table'
import {
  useGetAlbum,
  useGetAlbumInfo,
  useGetArtistAlbums,
  useGetGenreAlbums,
} from '@/app/hooks/use-album'
import ErrorPage from '@/app/pages/error-page'
import { songsColumns } from '@/app/tables/songs-columns'
import { ROUTES } from '@/routes/routesList'
import { usePlayerActions } from '@/store/player.store'
import { ColumnFilter } from '@/types/columnFilter'
import { Albums } from '@/types/responses/album'
import { convertSecondsToHumanRead } from '@/utils/convertSecondsToTime'

export default function Album() {
  const { albumId } = useParams() as { albumId: string }
  const { setSongList } = usePlayerActions()
  const { t } = useTranslation()

  const {
    data: album,
    isLoading: albumIsLoading,
    isFetched,
  } = useGetAlbum(albumId)
  const { data: albumInfo, isLoading: albumInfoIsLoading } =
    useGetAlbumInfo(albumId)
  const { data: moreAlbums, isLoading: moreAlbumsIsLoading } =
    useGetArtistAlbums(album?.artist || '')
  const { data: randomAlbums, isLoading: randomAlbumsIsLoading } =
    useGetGenreAlbums(album?.genre || '')

  if (albumIsLoading) return <AlbumFallback />
  if (isFetched && !album) {
    return <ErrorPage status={404} statusText="Not Found" />
  }
  if (!album) return <AlbumFallback />

  const columns = songsColumns()

  const albumDuration = album.duration
    ? convertSecondsToHumanRead(album.duration)
    : null

  const badges = [
    album.year || null,
    album.genre || null,
    album.songCount
      ? t('playlist.songCount', { count: album.songCount })
      : null,
    albumDuration ? t('playlist.duration', { duration: albumDuration }) : null,
  ]

  const columnsToShow: ColumnFilter[] = [
    'trackNumber',
    'title',
    'artist',
    'duration',
    'playCount',
    'played',
    'bitRate',
    'contentType',
    'select',
  ]

  function removeCurrentAlbumFromList(moreAlbums: Albums[]) {
    if (moreAlbums.length === 0) return null

    let list = moreAlbums.filter((item) => item.id !== album?.id)
    if (list.length > 16) list = list.slice(0, 16)

    if (list.length === 0) return null

    return list
  }

  const artistAlbums = moreAlbums?.album
    ? removeCurrentAlbumFromList(moreAlbums.album)
    : null

  const randomGenreAlbums =
    randomAlbums?.list && album.genre
      ? removeCurrentAlbumFromList(randomAlbums.list)
      : null

  const albumHasMoreThanOneDisc = album.discTitles.length > 1

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
        <AlbumButtons album={album} />

        <div className="mb-6">
          {albumInfoIsLoading && <InfoPanelFallback />}
          {albumInfo && !albumInfoIsLoading && (
            <InfoPanel
              title={album.name}
              bio={albumInfo.notes}
              lastFmUrl={albumInfo.lastFmUrl}
            />
          )}
        </div>

        <DataTable
          columns={columns}
          data={album.song}
          handlePlaySong={(row) => setSongList(album.song, row.index)}
          columnFilter={columnsToShow}
          showDiscNumber={albumHasMoreThanOneDisc}
        />

        <div className="mt-4">
          {moreAlbumsIsLoading && <PreviewListFallback />}
          {artistAlbums && !moreAlbumsIsLoading && (
            <PreviewList
              list={artistAlbums}
              showMore={true}
              title={t('album.more.listTitle')}
              moreTitle={t('album.more.discography')}
              moreRoute={ROUTES.ARTIST.ALBUMS(album.artistId)}
            />
          )}

          {randomAlbumsIsLoading && <PreviewListFallback />}
          {!randomAlbumsIsLoading && randomGenreAlbums && (
            <PreviewList
              list={randomGenreAlbums}
              showMore={false}
              title={t('album.more.genreTitle', {
                genre: album.genre,
              })}
            />
          )}
        </div>
      </ListWrapper>
    </div>
  )
}
