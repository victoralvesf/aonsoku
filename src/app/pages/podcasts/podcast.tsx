import { useQuery } from '@tanstack/react-query'
import { memo } from 'react'
import { useParams } from 'react-router-dom'
import { PodcastFallback } from '@/app/components/fallbacks/podcast-fallbacks'
import { EpisodeList } from '@/app/components/podcasts/episode-list'
import { PodcastInfo } from '@/app/components/podcasts/podcast-info'
import ErrorPage from '@/app/pages/error-page'
import { getPodcast } from '@/queries/podcasts'
import { queryKeys } from '@/utils/queryKeys'

const MemoPodcastInfo = memo(PodcastInfo)
const MemoEpisodeList = memo(EpisodeList)

export default function Podcast() {
  const { podcastId } = useParams() as { podcastId: string }

  const {
    data: podcast,
    isFetched,
    isLoading: podcastIsLoading,
  } = useQuery({
    queryKey: [queryKeys.podcast.one, podcastId],
    queryFn: () => getPodcast(podcastId),
  })

  if (podcastIsLoading) return <PodcastFallback />
  if (isFetched && !podcast) {
    return <ErrorPage status={404} statusText="Not Found" />
  }
  if (!podcast) return <PodcastFallback />

  return (
    <div className="h-full">
      <MemoPodcastInfo podcast={podcast} />
      <MemoEpisodeList />
    </div>
  )
}
