import { useMutation, useQueryClient } from '@tanstack/react-query'
import { podcasts } from '@/service/podcasts'
import { Episode } from '@/types/responses/podcasts'
import { queryKeys } from '@/utils/queryKeys'

interface PodcastOptionsProps {
  episode: Episode
}

export function usePodcastOptions({ episode }: PodcastOptionsProps) {
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

  return {
    markAsPlayedMutation,
  }
}
