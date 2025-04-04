import { useTranslation } from 'react-i18next'
import { useParams } from 'react-router-dom'
import { AlbumComment } from '@/app/components/album/comment'
import ImageHeader from '@/app/components/album/image-header'
import { AlbumInfo } from '@/app/components/album/info'
import { RecordLabelsInfo } from '@/app/components/album/record-labels'
import { AlbumFallback } from '@/app/components/fallbacks/album-fallbacks'
import { PreviewListFallback } from '@/app/components/fallbacks/home-fallbacks'
import { BadgesData } from '@/app/components/header-info'
import PreviewList from '@/app/components/home/preview-list'
import ListWrapper from '@/app/components/list-wrapper'
import { DataTable } from '@/app/components/ui/data-table'
import {
  useGetAlbum,
  useGetArtistAlbums,
  useGetGenreAlbums,
} from '@/app/hooks/use-album'
import ErrorPage from '@/app/pages/error-page'
import { songsColumns } from '@/app/tables/songs-columns'
import { ROUTES } from '@/routes/routesList'
import { usePlayerActions } from '@/store/player.store'
import { ColumnFilter } from '@/types/columnFilter'
import { Albums } from '@/types/responses/album'
import { sortRecentAlbums } from '@/utils/album'
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
  const { data: artist, isLoading: moreAlbumsIsLoading } = useGetArtistAlbums(
    album?.artistId || '',
  )
  const { data: randomAlbums, isLoading: randomAlbumsIsLoading } =
    useGetGenreAlbums(album?.genre || '')

  const moreAlbums = artist?.album

  if (albumIsLoading) return <AlbumFallback />
  if (isFetched && !album) {
    return <ErrorPage status={404} statusText="Not Found" />
  }
  if (!album) return <AlbumFallback />

  const columns = songsColumns()

  const albumDuration = album.duration
    ? convertSecondsToHumanRead(album.duration)
    : null

  const badges: BadgesData = [
    { content: album.year?.toString() ?? null, type: 'text' },
    {
      content: album.genre ?? null,
      type: 'link',
      link: ROUTES.ALBUMS.GENRE(album.genre),
    },
    {
      content: album.songCount
        ? t('playlist.songCount', { count: album.songCount })
        : null,
      type: 'text',
    },
    {
      content: albumDuration
        ? t('playlist.duration', { duration: albumDuration })
        : null,
      type: 'text',
    },
  ]

  const columnsToShow: ColumnFilter[] = [
    'trackNumber',
    'title',
    // 'artist',
    'duration',
    'playCount',
    'played',
    'bitRate',
    'contentType',
    'select',
  ]

  function removeCurrentAlbumFromList(moreAlbums: Albums[], sort = false) {
    if (moreAlbums.length === 0 || !album) return null

    let list = moreAlbums.filter((item) => item.id !== album.id)

    if (sort) {
      list = sortRecentAlbums(list)
    }

    if (list.length > 16) list = list.slice(0, 16)

    if (list.length === 0) return null

    return list
  }

  const artistAlbums = moreAlbums
    ? removeCurrentAlbumFromList(moreAlbums, true)
    : null

  const randomGenreAlbums =
    randomAlbums?.list && album.genre
      ? removeCurrentAlbumFromList(randomAlbums.list)
      : null

  const albumHasMoreThanOneDisc = album.discTitles
    ? album.discTitles.length > 1
    : false

  const albumComment = album.song.length > 0 ? album.song[0].comment : null

  return (
    <div className="w-full">
      <ImageHeader
        type={t('album.headline')}
        title={album.name}
        subtitle={album.artist}
        artistId={album.artistId}
        artists={album.artists}
        coverArtId={album.coverArt}
        coverArtType="album"
        coverArtSize="700"
        coverArtAlt={album.name}
        badges={badges}
      />

      <ListWrapper>
        <AlbumInfo album={album} />

        <DataTable
          columns={columns}
          data={album.song}
          handlePlaySong={(row) => setSongList(album.song, row.index)}
          columnFilter={columnsToShow}
          showDiscNumber={albumHasMoreThanOneDisc}
          variant="modern"
        />

        {albumComment && <AlbumComment comment={albumComment} />}

        <RecordLabelsInfo album={album} />

        <div className="mt-4">
          {moreAlbumsIsLoading && <PreviewListFallback />}
          {artistAlbums && !moreAlbumsIsLoading && album.artistId && (
            <PreviewList
              list={artistAlbums}
              showMore={true}
              title={t('album.more.listTitle')}
              moreTitle={t('album.more.discography')}
              moreRoute={ROUTES.ALBUMS.ARTIST(album.artistId, album.artist)}
            />
          )}

          {randomAlbumsIsLoading && <PreviewListFallback />}
          {!randomAlbumsIsLoading && randomGenreAlbums && (
            <PreviewList
              list={randomGenreAlbums}
              moreRoute={ROUTES.ALBUMS.GENRE(album.genre)}
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
