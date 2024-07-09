/* eslint-disable react/no-children-prop */
import { Suspense, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Await, useLoaderData } from 'react-router-dom'
import ImageHeader from '@/app/components/album/image-header'
import InfoPanel, { InfoPanelFallback } from '@/app/components/album/info-panel'
import { AlbumOptions } from '@/app/components/album/options'
import PlayButtons from '@/app/components/album/play-buttons'
import PreviewList from '@/app/components/home/preview-list'
import ListWrapper from '@/app/components/list-wrapper'
import PreviewListFallback from '@/app/components/preview-list-fallback'
import { DataTable } from '@/app/components/ui/data-table'
import { songsColumns } from '@/app/tables/songs-columns'
import { ROUTES } from '@/routes/routesList'
import { usePlayerActions } from '@/store/player.store'
import { ColumnFilter } from '@/types/columnFilter'
import {
  Albums,
  AlbumsListData,
  IAlbumInfo,
  SingleAlbum,
} from '@/types/responses/album'
import { Search } from '@/types/responses/search'
import { convertSecondsToHumanRead } from '@/utils/convertSecondsToTime'

interface ILoaderData {
  album: SingleAlbum
  artistAlbums: Promise<Search>
  albumInfo: Promise<IAlbumInfo>
  randomGenreAlbums?: Promise<AlbumsListData>
}

export default function Album() {
  const { album, artistAlbums, albumInfo, randomGenreAlbums } =
    useLoaderData() as ILoaderData

  const { setSongList } = usePlayerActions()
  const { t } = useTranslation()

  const columns = songsColumns()
  const memoizedAlbums = useMemo(() => album, [album])

  const albumDuration = memoizedAlbums.duration
    ? convertSecondsToHumanRead(memoizedAlbums.duration)
    : null

  const badges = [
    memoizedAlbums.year || null,
    memoizedAlbums.genre || null,
    memoizedAlbums.songCount
      ? t('playlist.songCount', { count: memoizedAlbums.songCount })
      : null,
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
    'starred',
  ]

  function formatMoreFromArtist(moreAlbums: Albums[]) {
    let list = moreAlbums.filter((item) => item.id !== memoizedAlbums.id)

    if (list.length > 16) list = list.slice(0, 16)

    return list
  }

  const buttonsTooltips = {
    play: t('playlist.buttons.play', { name: memoizedAlbums.name }),
    shuffle: t('playlist.buttons.shuffle', { name: memoizedAlbums.name }),
    options: t('playlist.buttons.options', { name: memoizedAlbums.name }),
  }

  return (
    <div className="w-full">
      <ImageHeader
        type={t('album.headline')}
        title={memoizedAlbums.name}
        subtitle={memoizedAlbums.artist}
        artistId={memoizedAlbums.artistId}
        coverArtId={memoizedAlbums.coverArt}
        coverArtSize="350"
        coverArtAlt={memoizedAlbums.name}
        badges={badges}
      />

      <ListWrapper>
        <PlayButtons
          playButtonTooltip={buttonsTooltips.play}
          handlePlayButton={() => setSongList(memoizedAlbums.song, 0)}
          shuffleButtonTooltip={buttonsTooltips.shuffle}
          handleShuffleButton={() => setSongList(memoizedAlbums.song, 0, true)}
          optionsTooltip={buttonsTooltips.options}
          showLikeButton={true}
          likeTooltipResource={memoizedAlbums.name}
          likeState={memoizedAlbums.starred}
          contentId={memoizedAlbums.id}
          optionsMenuItems={<AlbumOptions album={memoizedAlbums} />}
        />

        <div className="mb-6">
          <Suspense fallback={<InfoPanelFallback />}>
            <Await
              resolve={albumInfo}
              errorElement={<></>}
              children={(info: IAlbumInfo) => (
                <InfoPanel
                  title={memoizedAlbums.name}
                  bio={info.notes}
                  lastFmUrl={info.lastFmUrl}
                />
              )}
            />
          </Suspense>
        </div>

        <DataTable
          columns={columns}
          data={memoizedAlbums.song}
          handlePlaySong={(row) => setSongList(memoizedAlbums.song, row.index)}
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
                    moreRoute={ROUTES.ARTIST.ALBUMS(memoizedAlbums.artistId)}
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
                    title={t('album.more.genreTitle', {
                      genre: memoizedAlbums.genre,
                    })}
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
