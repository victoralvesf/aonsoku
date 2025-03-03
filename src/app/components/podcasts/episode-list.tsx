import { useInfiniteQuery } from '@tanstack/react-query'
import { useVirtualizer } from '@tanstack/react-virtual'
import { CSSProperties, memo, useEffect, useMemo, useRef } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import {
  EpisodeCardFallback,
  EpisodeListFallback,
} from '@/app/components/fallbacks/podcast-fallbacks'
import ListWrapper from '@/app/components/list-wrapper'
import { EpisodeCard } from '@/app/components/podcasts/episode-card'
import { getPodcastEpisodes, searchEpisodes } from '@/queries/podcasts'
import {
  AlbumsFilters,
  AlbumsSearchParams,
  EpisodesOrderByOptions,
  SortOptions,
} from '@/utils/albumsFilter'
import { queryKeys } from '@/utils/queryKeys'
import { getMainScrollElement } from '@/utils/scrollPageToTop'
import { SearchParamsHandler } from '@/utils/searchParamsHandler'
import { EpisodesFilters } from './episodes-filters'
import { NoEpisodesFound } from './no-episodes-found'

const MemoEpisodesFilters = memo(EpisodesFilters)

const { Query, MainFilter } = AlbumsSearchParams

const itemStyle = (top: number): CSSProperties => {
  return {
    position: 'absolute',
    width: '100%',
    top,
  }
}

export function EpisodeList() {
  const defaultPerPage = 40
  const { podcastId } = useParams() as { podcastId: string }

  const [searchParams] = useSearchParams()
  const { getSearchParam } = new SearchParamsHandler(searchParams)

  const scrollDivRef = useRef<HTMLDivElement | null>(null)

  const { PublishedAt } = EpisodesOrderByOptions
  const { Desc } = SortOptions

  const currentFilter = getSearchParam<string>(MainFilter, '')
  const orderByFilter = getSearchParam<EpisodesOrderByOptions>(
    'orderBy',
    PublishedAt,
  )
  const sortFilter = getSearchParam<SortOptions>('sort', Desc)
  const query = getSearchParam<string>(Query, '')

  useEffect(() => {
    scrollDivRef.current = getMainScrollElement()
  }, [])

  const fetchEpisodes = async ({ pageParam = 1 }) => {
    if (currentFilter === AlbumsFilters.Search && query !== '') {
      return searchEpisodes(podcastId, {
        query,
        order_by: orderByFilter,
        sort: sortFilter,
        page: pageParam,
        per_page: defaultPerPage,
        filter_by: 'title',
      })
    }

    return getPodcastEpisodes(podcastId, {
      order_by: orderByFilter,
      sort: sortFilter,
      page: pageParam,
      per_page: defaultPerPage,
    })
  }

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isLoading,
    isFetching,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [
      queryKeys.episode.all,
      podcastId,
      orderByFilter,
      sortFilter,
      currentFilter,
      query,
    ],
    queryFn: fetchEpisodes,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
  })

  const episodes = data ? data.pages.flatMap((page) => page.episodes) : []

  const episodeCount = useMemo(() => {
    if (data && data.pages.length > 0) {
      const count = data.pages[0].count
      if (count) return count
    }

    return hasNextPage ? episodes.length + 1 : episodes.length
  }, [data, episodes.length, hasNextPage])

  const virtualizer = useVirtualizer({
    count: episodeCount,
    getScrollElement: () => scrollDivRef.current,
    estimateSize: () => 124,
    overscan: 5,
  })

  const items = virtualizer.getVirtualItems()

  useEffect(() => {
    const [lastItem] = [...items].reverse()
    if (!lastItem || isFetching) return

    const lastItemIsLoader = lastItem.index >= episodes.length - 1
    if (lastItemIsLoader && hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [
    episodes.length,
    fetchNextPage,
    hasNextPage,
    isFetching,
    isFetchingNextPage,
    items,
  ])

  if (isLoading) return <EpisodeListFallback />
  if (!data || episodes.length === 0) return <NoEpisodesFound />

  return (
    <div>
      <MemoEpisodesFilters />

      <ListWrapper className="px-4">
        <div
          style={{
            height: virtualizer.getTotalSize(),
            position: 'relative',
          }}
        >
          {items.map((virtualRow) => {
            const isLoaderRow = virtualRow.index > episodes.length - 1

            if (isLoaderRow) {
              return (
                <div key={virtualRow.index} style={itemStyle(virtualRow.start)}>
                  <EpisodeCardFallback />
                </div>
              )
            }

            const episode = episodes[virtualRow.index]

            return (
              <EpisodeCard
                episode={episode}
                key={virtualRow.index}
                style={itemStyle(virtualRow.start)}
              />
            )
          })}
        </div>
      </ListWrapper>
    </div>
  )
}
