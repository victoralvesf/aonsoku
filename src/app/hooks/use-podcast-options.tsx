import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { ROUTES } from '@/routes/routesList'
import { podcasts } from '@/service/podcasts'
import { Episode } from '@/types/responses/podcasts'
import { queryKeys } from '@/utils/queryKeys'
import { isTauri } from '@/utils/tauriTools'
import { useDownload } from './use-download'

interface PodcastOptionsProps {
  episode: Episode
}

export function usePodcastOptions({ episode }: PodcastOptionsProps) {
  const navigate = useNavigate()
  const queryClient = useQueryClient()
  const { downloadBrowser, downloadTauri } = useDownload()

  function handleDownload() {
    if (isTauri()) {
      downloadTauri(episode.audio_url, episode.id)
    } else {
      downloadBrowser(episode.audio_url, episode.id)
    }
  }

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
    handleDownload,
    markAsPlayedMutation,
    gotoPodcast,
    gotoEpisode,
  }
}
