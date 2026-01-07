import { useInfiniteQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { ShadowHeader } from '@/app/components/album/shadow-header'
import { InfinitySongListFallback } from '@/app/components/fallbacks/song-fallbacks'
import { HeaderTitle } from '@/app/components/header-title'
//import { ClearFilterButton } from '@/app/components/search/clear-filter-button' (riddlah): Disable search in loved songs. We need make it at first
//import { ExpandableSearchInput } from '@/app/components/search/expandable-input'
import { DataTableList } from '@/app/components/ui/data-table-list'
import { useLovedSongs } from '@/app/hooks/use-loved-songs'
import { songsColumns } from '@/app/tables/songs-columns'
import { getLovedArtistAllSongs, songsSearchLoved } from '@/queries/lovedsongs'
import { usePlayerActions } from '@/store/player.store'
import { ColumnFilter } from '@/types/columnFilter'
import { AlbumsFilters, AlbumsSearchParams } from '@/utils/albumsFilter'
import { queryKeys } from '@/utils/queryKeys'
import { SearchParamsHandler } from '@/utils/searchParamsHandler'

const DEFAULT_OFFSET = 100

export default function SongList() {
  const { t } = useTranslation()
  const { setSongList } = usePlayerActions()
  const [searchParams] = useSearchParams()
  const { getSearchParam } = new SearchParamsHandler(searchParams)
  const columns = songsColumns()

  const filter = getSearchParam<string>(AlbumsSearchParams.MainFilter, '')
  const query = getSearchParam<string>(AlbumsSearchParams.Query, '')
  const artistId = getSearchParam<string>(AlbumsSearchParams.ArtistId, '')
  const artistName = getSearchParam<string>(AlbumsSearchParams.ArtistName, '')

  const searchFilterIsSet = filter === AlbumsFilters.Search && query !== ''
  const filterByArtist = artistId !== '' && artistName !== ''
  const hasSomeFilter = searchFilterIsSet || filterByArtist

  async function fetchSongs({ pageParam = 0 }) {
    if (filterByArtist) {
      return getLovedArtistAllSongs(artistId)
    }

    return songsSearchLoved({
      query: searchFilterIsSet ? query : '',
      songCount: DEFAULT_OFFSET,
      songOffset: pageParam,
    })
  }

  const { data, isLoading, isFetchingNextPage, fetchNextPage, hasNextPage } =
    useInfiniteQuery({
      queryKey: [queryKeys.song.all, filter, query, artistId],
      initialPageParam: 0,
      queryFn: fetchSongs,
      getNextPageParam: (lastPage) => lastPage.nextOffset,
    })

  const { data: songCountData, isLoading: songCountIsLoading } = useLovedSongs()

  if (isLoading && !isFetchingNextPage) {
    return <InfinitySongListFallback />
  }
  if (!data) return null

  const songlist = data.pages.flatMap((page) => page.songs) ?? []
  const songCount = (hasSomeFilter ? songlist.length : songCountData) ?? 0

  function handlePlaySong(index: number) {
    if (songlist) setSongList(songlist, index)
  }

  const columnsToShow: ColumnFilter[] = [
    'index',
    'title',
    // 'artist',
    'album',
    'duration',
    'playCount',
    'played',
    'contentType',
    'select',
  ]

  const title = filterByArtist
    ? t('songs.list.byArtist', { artist: artistName })
    : t('sidebar.lovedsongs')

  return (
    <div className="w-full h-content">
      <ShadowHeader
        showGlassEffect={false}
        fixed={false}
        className="relative w-full justify-between items-center"
      >
        <HeaderTitle
          title={title}
          count={songCount}
          loading={songCountIsLoading}
        />
{/* (riddlah): Disable search for loved songs. We need make at first lol
        <div className="flex gap-2 flex-1 justify-end">
          {filterByArtist && <ClearFilterButton />}
          <ExpandableSearchInput
            placeholder={t('songs.list.search.placeholder')}
          />
        </div>
*/}
      </ShadowHeader>

      <div className="w-full h-[calc(100%-80px)] overflow-auto">
        <DataTableList
          columns={columns}
          data={songlist}
          handlePlaySong={(row) => handlePlaySong(row.index)}
          columnFilter={columnsToShow}
          fetchNextPage={fetchNextPage}
          hasNextPage={hasNextPage}
        />
      </div>
    </div>
  )
}
