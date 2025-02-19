import { useQuery } from '@tanstack/react-query'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useEffect, useMemo, useRef } from 'react'
import { LatestEpisodesFallback } from '@/app/components/fallbacks/podcast-fallbacks'
import ListWrapper from '@/app/components/list-wrapper'
import { EpisodeCard } from '@/app/components/podcasts/episode-card'
import ErrorPage from '@/app/pages/error-page'
import { podcasts } from '@/service/podcasts'
import { queryKeys } from '@/utils/queryKeys'
import { getMainScrollElement } from '@/utils/scrollPageToTop'

export default function LatestEpisodes() {
  const scrollDivRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    scrollDivRef.current = getMainScrollElement()
  }, [])

  const { data, isFetched, isFetching, isLoading } = useQuery({
    queryKey: [queryKeys.episode.latest],
    queryFn: podcasts.getLatest,
  })

  const episodes = useMemo(() => data || [], [data])

  const virtualizer = useVirtualizer({
    count: episodes.length,
    getScrollElement: () => scrollDivRef.current,
    estimateSize: () => 124,
    overscan: 5,
  })

  if (isLoading || isFetching) return <LatestEpisodesFallback />
  if (isFetched && !data) {
    return <ErrorPage />
  }

  const items = virtualizer.getVirtualItems()

  return (
    <div className="w-full">
      <ListWrapper className="px-4 pt-4">
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
