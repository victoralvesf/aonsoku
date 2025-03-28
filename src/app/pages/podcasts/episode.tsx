import { useQuery } from '@tanstack/react-query'
import { useParams } from 'react-router-dom'
import { Actions } from '@/app/components/actions'
import { EpisodeFallback } from '@/app/components/fallbacks/podcast-fallbacks'
import ListWrapper from '@/app/components/list-wrapper'
import { EpisodeInfo } from '@/app/components/podcasts/episode-info'
import {
  useIsEpisodePlaying,
  usePlayEpisode,
} from '@/app/hooks/use-podcast-playing'
import { podcasts } from '@/service/podcasts'
import { linkifyText, sanitizeLinks } from '@/utils/parseTexts'
import { queryKeys } from '@/utils/queryKeys'

export default function Episode() {
  const { episodeId } = useParams() as { episodeId: string }

  const { data: episode, isLoading } = useQuery({
    queryKey: [queryKeys.episode.one, episodeId],
    queryFn: () => podcasts.getEpisode(episodeId),
  })

  if (isLoading) return <EpisodeFallback />
  if (!episode) return <EpisodeFallback />

  function formatDescription(text: string) {
    const parsed = sanitizeLinks(text)
    const final = linkifyText(parsed)

    return { __html: final }
  }

  return (
    <div className="h-full">
      <EpisodeInfo episode={episode} />

      <ListWrapper>
        <Actions.Container className="mt-0">
          <EpisodePlayButton id={episodeId} />
        </Actions.Container>

        <div
          dangerouslySetInnerHTML={formatDescription(episode.description)}
          className="html leading-relaxed max-w-full"
        />
      </ListWrapper>
    </div>
  )
}

function EpisodePlayButton({ id }: { id: string }) {
  const { isPlaying, isEpisodePlaying } = useIsEpisodePlaying({ id })
  const { handlePlayEpisode } = usePlayEpisode({ id })

  const isCurrentlyPlaying = isEpisodePlaying && isPlaying
  const isNotPlaying = (isEpisodePlaying && !isPlaying) || !isEpisodePlaying

  return (
    <Actions.Button buttonStyle="primary" onClick={handlePlayEpisode}>
      {isCurrentlyPlaying && <Actions.PauseIcon />}
      {isNotPlaying && <Actions.PlayIcon />}
    </Actions.Button>
  )
}
