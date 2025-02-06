import { useInfiniteQuery, useQuery } from '@tanstack/react-query'
import { useVirtualizer } from '@tanstack/react-virtual'
import debounce from 'lodash/debounce'
import { memo, useEffect, useRef } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { PodcastFallback } from '@/app/components/fallbacks/podcast-fallbacks'
import ListWrapper from '@/app/components/list-wrapper'
import { EpisodeCard } from '@/app/components/podcasts/episode-card'
import { EpisodesFilters } from '@/app/components/podcasts/episodes-filters'
import { PodcastInfo } from '@/app/components/podcasts/podcast-info'
import ErrorPage from '@/app/pages/error-page'
import { getPodcast, getPodcastEpisodes } from '@/queries/podcasts'
import { EpisodesOrderByOptions, SortOptions } from '@/utils/albumsFilter'
import { queryKeys } from '@/utils/queryKeys'
import { SearchParamsHandler } from '@/utils/searchParamsHandler'

const MemoPodcastInfo = memo(PodcastInfo)

export default function Podcast() {
  const [searchParams] = useSearchParams()
  const { getSearchParam } = new SearchParamsHandler(searchParams)
  const defaultPerPage = 40
  const { podcastId } = useParams() as { podcastId: string }
  const scrollDivRef = useRef<HTMLDivElement | null>(null)
  const { PublishedAt } = EpisodesOrderByOptions
  const { Desc } = SortOptions

  const orderByFilter = getSearchParam<EpisodesOrderByOptions>(
    'orderBy',
    PublishedAt,
  )
  const sortFilter = getSearchParam<SortOptions>('sort', Desc)

  useEffect(() => {
    scrollDivRef.current = document.querySelector(
      '#main-scroll-area #scroll-viewport',
    ) as HTMLDivElement
  }, [])

  const {
    data: podcast,
    isFetched,
    isLoading: podcastIsLoading,
  } = useQuery({
    queryKey: [queryKeys.podcast.one, podcastId],
    queryFn: () => getPodcast(podcastId),
  })

  const fetchEpisodes = async ({ pageParam = 1 }) => {
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
    queryKey: [queryKeys.episode.all, podcastId, orderByFilter, sortFilter],
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

  if (episodesIsLoading || podcastIsLoading) return <PodcastFallback />
  if (isFetched && !podcast) {
    return <ErrorPage status={404} statusText="Not Found" />
  }
  if (!podcast) return <PodcastFallback />
  if (!data) return <PodcastFallback />

  const items = virtualizer.getVirtualItems()

  return (
    <div className="h-full">
      <MemoPodcastInfo podcast={podcast} />
      <EpisodesFilters />

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
    </div>
  )
}
