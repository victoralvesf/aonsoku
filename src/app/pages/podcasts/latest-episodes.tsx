import { useQuery } from '@tanstack/react-query'
import { memo, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { ShadowHeader } from '@/app/components/album/shadow-header'
import { LatestEpisodesFallback } from '@/app/components/fallbacks/podcast-fallbacks'
import { HeaderTitle } from '@/app/components/header-title'
import ListWrapper from '@/app/components/list-wrapper'
import { EmptyLatestEpisodesPage } from '@/app/components/podcasts/empty-latest-episodes'
import { FeaturedEpisodeCard } from '@/app/components/podcasts/featured-episode-card'
import { LatestEpisodesList } from '@/app/components/podcasts/latest-episodes-list'
import { podcasts } from '@/service/podcasts'
import { queryKeys } from '@/utils/queryKeys'

const episodesToFeature = 5

const MemoShadowHeader = memo(ShadowHeader)
const MemoHeaderTitle = memo(HeaderTitle)
const MemoFeaturedEpisodeCard = memo(FeaturedEpisodeCard)

export default function LatestEpisodes() {
  const { t } = useTranslation()

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

  if (isLoading) return <LatestEpisodesFallback />
  if (!isFetching && isFetched && (!data || data.length === 0)) {
    return <EmptyLatestEpisodesPage />
  }

  return (
    <div className="w-full">
      <MemoShadowHeader>
        <MemoHeaderTitle title={t('podcasts.form.latestEpisodes')} />
      </MemoShadowHeader>

      <ListWrapper className="px-4 pt-[--shadow-header-distance]">
        <div className="grid grid-cols-5 gap-4 px-4 mb-6">
          {featuredEpisodes.map((episode) => (
            <MemoFeaturedEpisodeCard key={episode.id} episode={episode} />
          ))}
        </div>

        <LatestEpisodesList episodes={episodes} />
      </ListWrapper>
    </div>
  )
}
