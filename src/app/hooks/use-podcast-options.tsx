import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/routes/routesList'
import { podcasts } from '@/service/podcasts'
import { Episode } from '@/types/responses/podcasts'
import { queryKeys } from '@/utils/queryKeys'

interface PodcastOptionsProps {
  episode: Episode
}

export function usePodcastOptions({ episode }: PodcastOptionsProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const markAsPlayedMutation = useMutation({
    mutationFn: () =>
      podcasts.saveEpisodeProgress(episode.id, episode.duration),
    onSuccess: () => {
      Promise.all([
        queryClient.invalidateQueries({
          queryKey: [queryKeys.episode.latest],
        }),
        queryClient.invalidateQueries({
          queryKey: [queryKeys.episode.all, episode.podcast_id],
        }),
      ])
    },
  })

  function gotoPodcast() {
    navigate(ROUTES.PODCASTS.PAGE(episode.podcast_id))
  }

  function gotoEpisode() {
    navigate(ROUTES.EPISODES.PAGE(episode.id))
  }

  return {
    markAsPlayedMutation,
    gotoPodcast,
    gotoEpisode,
  }
}
