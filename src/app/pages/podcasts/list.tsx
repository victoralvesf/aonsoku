import { useInfiniteQuery } from '@tanstack/react-query'
import debounce from 'lodash/debounce'
import { useEffect, useRef } from 'react'
import { AlbumsFallback } from '@/app/components/fallbacks/album-fallbacks'
import ListWrapper from '@/app/components/list-wrapper'
import { EmptyPodcastsPage } from '@/app/components/podcasts/empty-page'
import { PodcastsHeader } from '@/app/components/podcasts/header'
import { PreviewCard } from '@/app/components/preview-card/card'
import { getPodcastList } from '@/queries/podcasts'

export default function PodcastsList() {
  const defaultPerPage = 32
  const scrollDivRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    scrollDivRef.current = document.querySelector(
      '#main-scroll-area #scroll-viewport',
    ) as HTMLDivElement
  }, [])

  const fetchPodcasts = async ({ pageParam = 1 }) => {
    return getPodcastList({
      order_by: 'title',
      sort: 'asc',
      page: pageParam,
      per_page: defaultPerPage,
    })
  }

  const { data, fetchNextPage, hasNextPage, isLoading } = useInfiniteQuery({
    queryKey: ['get-all-podcasts'],
    queryFn: fetchPodcasts,
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage.nextOffset,
  })

  useEffect(() => {
    const handleScroll = debounce(() => {
      if (!scrollDivRef.current) return

      const { scrollTop, clientHeight, scrollHeight } = scrollDivRef.current

      const isNearBottom =
        scrollTop + clientHeight >= scrollHeight - scrollHeight / 4

      if (isNearBottom) {
        if (hasNextPage) fetchNextPage()
      }
    }, 200)

    const scrollElement = scrollDivRef.current
    scrollElement?.addEventListener('scroll', handleScroll)
    return () => {
      scrollElement?.removeEventListener('scroll', handleScroll)
    }
  }, [fetchNextPage, hasNextPage])

  if (isLoading) return <AlbumsFallback />
  if (!data) return <EmptyPodcastsPage />

  const items = data.pages.flatMap((page) => page.podcasts) || []

  if (items.length === 0) return <EmptyPodcastsPage />

  return (
    <div className="w-full h-full">
      <PodcastsHeader />

      <ListWrapper className="pt-[--shadow-header-distance]">
        <div
          className="grid grid-cols-6 2xl:grid-cols-8 gap-4 h-full"
          data-testid="albums-grid"
        >
          {items.map((podcast) => (
            <PreviewCard.Root key={`podcast-${podcast.id}`}>
              <PreviewCard.ImageWrapper link={`/podcasts/${podcast.id}`}>
                <PreviewCard.Image
                  src={podcast.image_url}
                  alt={podcast.title}
                />
              </PreviewCard.ImageWrapper>
              <PreviewCard.InfoWrapper>
                <PreviewCard.Title link={`/podcasts/${podcast.id}`}>
                  {podcast.title}
                </PreviewCard.Title>
                <PreviewCard.Subtitle enableLink={false} link="#">
                  {podcast.author}
                </PreviewCard.Subtitle>
              </PreviewCard.InfoWrapper>
            </PreviewCard.Root>
          ))}
        </div>
      </ListWrapper>
    </div>
  )
}
