import { useInfiniteQuery } from '@tanstack/react-query'
import { Loader2 } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { ShadowHeader } from '@/app/components/album/shadow-header'
import { InfinitySongListFallback } from '@/app/components/fallbacks/song-fallbacks'
import { ExpandableSearchInput } from '@/app/components/search/expandable-input'
import { Badge } from '@/app/components/ui/badge'
import { DataTableList } from '@/app/components/ui/data-table-list'
import { useTotalSongs } from '@/app/hooks/use-total-songs'
import { songsColumns } from '@/app/tables/songs-columns'
import { songsSearch } from '@/queries/songs'
import { usePlayerActions } from '@/store/player.store'
import { ColumnFilter } from '@/types/columnFilter'
import { queryKeys } from '@/utils/queryKeys'
import { SearchParamsHandler } from '@/utils/searchParamsHandler'

const DEFAULT_OFFSET = 250

export default function SongList() {
  const { t } = useTranslation()
  const { setSongList } = usePlayerActions()
  const [searchParams] = useSearchParams()
  const { getSearchParam } = new SearchParamsHandler(searchParams)
  const columns = songsColumns()

  const filter = getSearchParam<string>('filter', '')
  const query = getSearchParam<string>('query', '')

  const searchFilterIsSet = filter === 'search' && query !== ''

  async function fetchSongs({ pageParam = 0 }) {
    return songsSearch({
      query: searchFilterIsSet ? query : '',
      songCount: DEFAULT_OFFSET,
      songOffset: pageParam,
    })
  }

  const { data, isLoading, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: [queryKeys.song.all, filter, query],
    initialPageParam: 0,
    queryFn: fetchSongs,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
  })

  const { data: songCountData, isLoading: songCountIsLoading } = useTotalSongs()

  if (isLoading) return <InfinitySongListFallback />
  if (!data) return null

  const songlist = data.pages.flatMap((page) => page.songs) ?? []
  const songCount = searchFilterIsSet
    ? songlist.length ?? 0
    : songCountData ?? 0

  function handlePlaySong(index: number) {
    if (songlist) setSongList(songlist, index)
  }

  const columnsToShow: ColumnFilter[] = [
    'index',
    'title',
    'artist',
    'album',
    'duration',
    'playCount',
    'played',
    'contentType',
    'select',
  ]

  return (
    <div className="w-full h-app-screen">
      <ShadowHeader className="relative w-full top-0 left-0 lg:left-0 justify-between items-center">
        <div className="flex gap-2 items-center">
          <h2 className="text-2xl font-semibold tracking-tight">
            {t('sidebar.songs')}
          </h2>
          <Badge variant="secondary" className="text-foreground/70">
            {songCountIsLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              songCount
            )}
          </Badge>
        </div>

        <div className="flex gap-2 flex-1 justify-end">
          <ExpandableSearchInput
            placeholder={t('songs.list.search.placeholder')}
          />
        </div>
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
