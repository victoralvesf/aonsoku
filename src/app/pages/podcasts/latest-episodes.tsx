import { useQuery } from '@tanstack/react-query'
import { useVirtualizer } from '@tanstack/react-virtual'
import { useEffect, useMemo, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { ShadowHeader } from '@/app/components/album/shadow-header'
import { LatestEpisodesFallback } from '@/app/components/fallbacks/podcast-fallbacks'
import { HeaderTitle } from '@/app/components/header-title'
import ListWrapper from '@/app/components/list-wrapper'
import { EpisodeCard } from '@/app/components/podcasts/episode-card'
import { FeaturedEpisodeCard } from '@/app/components/podcasts/featured-episode-card'
import ErrorPage from '@/app/pages/error-page'
import { podcasts } from '@/service/podcasts'
import { queryKeys } from '@/utils/queryKeys'
import { getMainScrollElement } from '@/utils/scrollPageToTop'

const episodesToFeature = 5

export default function LatestEpisodes() {
  const { t } = useTranslation()
  const scrollDivRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    scrollDivRef.current = getMainScrollElement()
  }, [])

  const { data, isFetched, isFetching, isLoading } = useQuery({
    queryKey: [queryKeys.episode.latest],
    queryFn: podcasts.getLatest,
  })

  const episodes = useMemo(() => {
    return data ? data.slice(episodesToFeature) : []
  }, [data])

  const featuredEpisodes = useMemo(() => {
    return data ? data.slice(0, episodesToFeature) : []
  }, [data])

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
      <ShadowHeader>
        <HeaderTitle title={t('podcasts.form.latestEpisodes')} />
      </ShadowHeader>

      <ListWrapper className="px-4 pt-[--shadow-header-distance]">
        <div className="grid grid-cols-5 gap-4 px-4 mb-6">
          {featuredEpisodes.map((episode) => (
            <FeaturedEpisodeCard key={episode.id} episode={episode} />
          ))}
        </div>

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
