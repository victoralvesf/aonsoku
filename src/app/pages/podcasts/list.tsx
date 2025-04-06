import { useInfiniteQuery } from '@tanstack/react-query'
import debounce from 'lodash/debounce'
import { useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { AlbumsFallback } from '@/app/components/fallbacks/album-fallbacks'
import ListWrapper from '@/app/components/list-wrapper'
import { MainGrid } from '@/app/components/main-grid'
import { EmptyPodcastsPage } from '@/app/components/podcasts/empty-page'
import { EmptyPodcastsResults } from '@/app/components/podcasts/empty-results'
import { PodcastsHeader } from '@/app/components/podcasts/header'
import { PodcastListImage } from '@/app/components/podcasts/list-image'
import { PreviewCard } from '@/app/components/preview-card/card'
import { getPodcastList, searchPodcasts } from '@/queries/podcasts'
import { ROUTES } from '@/routes/routesList'
import {
  AlbumsFilters,
  AlbumsSearchParams,
  PodcastsOrderByOptions,
  SortOptions,
} from '@/utils/albumsFilter'
import { queryKeys } from '@/utils/queryKeys'
import { getMainScrollElement } from '@/utils/scrollPageToTop'
import { SearchParamsHandler } from '@/utils/searchParamsHandler'

const { Query, MainFilter } = AlbumsSearchParams

export default function PodcastsList() {
  const defaultPerPage = 40
  const scrollDivRef = useRef<HTMLDivElement | null>(null)
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const { getSearchParam } = new SearchParamsHandler(searchParams)
  const { Title } = PodcastsOrderByOptions
  const { Asc } = SortOptions

  const currentFilter = getSearchParam<string>(MainFilter, '')
  const orderByFilter = getSearchParam<PodcastsOrderByOptions>('orderBy', Title)
  const sortFilter = getSearchParam<SortOptions>('sort', Asc)
  const query = getSearchParam<string>(Query, '')
  const isSearchState = currentFilter === AlbumsFilters.Search

  useEffect(() => {
    scrollDivRef.current = getMainScrollElement()
  }, [])

  const fetchPodcasts = async ({ pageParam = 1 }) => {
    if (isSearchState && query !== '') {
      return searchPodcasts({
        query,
        filter_by: 'title',
        page: pageParam,
        per_page: defaultPerPage,
      })
    }

    return getPodcastList({
      order_by: orderByFilter,
      sort: sortFilter,
      page: pageParam,
      per_page: defaultPerPage,
    })
  }

  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
    queryKey: [
      queryKeys.podcast.all,
      currentFilter,
      query,
      orderByFilter,
      sortFilter,
    ],
    queryFn: fetchPodcasts,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
  })

  useEffect(() => {
    const scrollElement = scrollDivRef.current
    if (!scrollElement) return

    const handleScroll = debounce(() => {
      const { scrollTop, clientHeight, scrollHeight } = scrollElement

      const isNearBottom =
        scrollTop + clientHeight >= scrollHeight - scrollHeight / 4

      if (isNearBottom) {
        if (hasNextPage) fetchNextPage()
      }
    }, 200)

    scrollElement.addEventListener('scroll', handleScroll)
    return () => {
      scrollElement.removeEventListener('scroll', handleScroll)
    }
  }, [fetchNextPage, hasNextPage])

  if (isLoading) return <AlbumsFallback />
  if (!data) return <EmptyPodcastsPage />

  const items = data.pages.flatMap((page) => page.podcasts) || []

  if (items.length === 0) {
    if (isSearchState) return <EmptyPodcastsResults />

    return <EmptyPodcastsPage />
  }

  return (
    <div className="w-full h-full">
      <PodcastsHeader />

      <ListWrapper className="pt-[--shadow-header-distance]">
        <MainGrid data-testid="podcasts-grid">
          {items.map((podcast) => (
            <PreviewCard.Root key={`podcast-${podcast.id}`}>
              <PreviewCard.ImageWrapper link={ROUTES.PODCASTS.PAGE(podcast.id)}>
                <PodcastListImage podcast={podcast} />
              </PreviewCard.ImageWrapper>
              <PreviewCard.InfoWrapper>
                <PreviewCard.Title link={ROUTES.PODCASTS.PAGE(podcast.id)}>
                  {podcast.title}
                </PreviewCard.Title>
                <PreviewCard.Subtitle>{podcast.author}</PreviewCard.Subtitle>
                <PreviewCard.Subtitle className="mt-[1px]">
                  {t('podcasts.header.episodeCount', {
                    count: podcast.episode_count,
                  })}
                </PreviewCard.Subtitle>
              </PreviewCard.InfoWrapper>
            </PreviewCard.Root>
          ))}
        </MainGrid>
      </ListWrapper>
    </div>
  )
}
