import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { ShadowHeader } from '@/app/components/album/shadow-header'
import { InfinitySongListFallback } from '@/app/components/fallbacks/song-fallbacks'
import { HeaderTitle } from '@/app/components/header-title'
import { ClearFilterButton } from '@/app/components/search/clear-filter-button'
import { DataTableList } from '@/app/components/ui/data-table-list'
import { useFavoriteSongsByArtist } from '@/app/hooks/use-favorite-songs'
import { songsColumns } from '@/app/tables/songs-columns'
import { usePlayerActions } from '@/store/player.store'
import { ColumnFilter } from '@/types/columnFilter'
import { AlbumsSearchParams } from '@/utils/albumsFilter'
import { SearchParamsHandler } from '@/utils/searchParamsHandler'

export default function SongList() {
  const { t } = useTranslation()
  const columns = songsColumns()
  const { setSongList } = usePlayerActions()

  const [searchParams] = useSearchParams()
  const { getSearchParam } = new SearchParamsHandler(searchParams)
  const filterArtistId = getSearchParam<string>(AlbumsSearchParams.ArtistId, '')
  const filterArtistName = getSearchParam<string>(
    AlbumsSearchParams.ArtistName,
    '',
  )
  const filterByArtist = filterArtistId !== '' && filterArtistName !== ''

  const { data: songs, isLoading } = useFavoriteSongsByArtist(
    filterByArtist ? filterArtistId : undefined,
    filterByArtist ? filterArtistName : undefined,
  )

  if (isLoading) {
    return <InfinitySongListFallback />
  }
  if (!songs) return null

  const songlist = songs
  const songCount = songlist.length

  function handlePlaySong(index: number) {
    setSongList(songlist, index, false, {
      type: 'favourite',
      id: filterByArtist ? `favourite:${filterArtistId}` : 'favourite',
      name: filterByArtist
        ? t('favorites.byArtist', { artist: filterArtistName })
        : t('sidebar.favorites'),
    })
  }

  const columnsToShow: ColumnFilter[] = [
    'index',
    'title',
    'album',
    'duration',
    'playCount',
    'played',
    'contentType',
    'select',
  ]

  const title = filterByArtist
    ? t('favorites.byArtist', { artist: filterArtistName })
    : t('sidebar.favorites')

  return (
    <div className="w-full h-content">
      <ShadowHeader
        showGlassEffect={false}
        fixed={false}
        className="relative w-full justify-between items-center"
      >
        <HeaderTitle title={title} count={songCount} loading={isLoading} />

        <div className="flex gap-2 flex-1 justify-end">
          {filterByArtist && <ClearFilterButton />}
        </div>
      </ShadowHeader>

      <div className="w-full h-[calc(100%-80px)] overflow-auto">
        <DataTableList
          columns={columns}
          data={songlist}
          handlePlaySong={(row) => handlePlaySong(row.index)}
          columnFilter={columnsToShow}
          noRowsMessage={t('favorites.noSongList')}
        />
      </div>
    </div>
  )
}
