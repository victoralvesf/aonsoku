import { useInfiniteQuery } from '@tanstack/react-query'
import { useVirtualizer } from '@tanstack/react-virtual'
import debounce from 'lodash/debounce'
import { useEffect, useRef } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { EpisodeListFallback } from '@/app/components/fallbacks/podcast-fallbacks'
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

const { Query, MainFilter } = AlbumsSearchParams

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
    isLoading: episodesIsLoading,
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

  const episodes = data?.pages.flatMap((page) => page.episodes) || []

  const virtualizer = useVirtualizer({
    count: episodes.length,
    getScrollElement: () => scrollDivRef.current,
    estimateSize: () => 124,
    overscan: 5,
  })

  useEffect(() => {
    const handleScroll = debounce(() => {
      if (!scrollDivRef.current) return

      const { scrollTop, clientHeight, scrollHeight } = scrollDivRef.current

      const isNearBottom =
        scrollTop + clientHeight >= scrollHeight - scrollHeight / 4

      if (isNearBottom && hasNextPage && !isFetchingNextPage) {
        fetchNextPage()
      }
    }, 200)

    const scrollElement = scrollDivRef.current
    scrollElement?.addEventListener('scroll', handleScroll)
    return () => {
      scrollElement?.removeEventListener('scroll', handleScroll)
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage])

  if (episodesIsLoading) return <EpisodeListFallback />
  if (!data) return <EpisodeListFallback />

  const items = virtualizer.getVirtualItems()

  return (
    <ListWrapper className="px-4">
      <div
        style={{
          height: virtualizer.getTotalSize(),
          position: 'relative',
        }}
      >
        {items.map((virtualRow) => {
          const episode = episodes[virtualRow.index]

          return (
            <EpisodeCard
              episode={episode}
              key={virtualRow.index}
              style={{
                position: 'absolute',
                top: virtualRow.start,
                width: '100%',
              }}
            />
          )
        })}
      </div>
    </ListWrapper>
  )
}
