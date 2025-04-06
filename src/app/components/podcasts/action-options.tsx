import { OptionsButtons } from '@/app/components/options/buttons'
import { DropdownMenuSeparator } from '@/app/components/ui/dropdown-menu'
import { usePodcastOptions } from '@/app/hooks/use-podcast-options'
import { useEpisodeQueue } from '@/app/hooks/use-podcast-playing'
import { Episode } from '@/types/responses/podcasts'

interface ActionOptionsProps {
  episode: Episode
  latest?: boolean
}

export function PodcastActionOptions({ episode, latest }: ActionOptionsProps) {
  const { handlePlayNext, handlePlayLast } = useEpisodeQueue({ id: episode.id })
  const { handleDownload, markAsPlayedMutation, gotoEpisode, gotoPodcast } =
    usePodcastOptions({ episode })

  function handleMarkAsPlayed() {
    markAsPlayedMutation.mutate()
  }

  return (
    <>
      <OptionsButtons.PlayNext
        variant="dropdown"
        onClick={(e) => {
          e.stopPropagation()
          handlePlayNext()
        }}
      />
      <OptionsButtons.PlayLast
        variant="dropdown"
        onClick={(e) => {
          e.stopPropagation()
          handlePlayLast()
        }}
      />
      <OptionsButtons.MarkAsPlayed
        variant="dropdown"
        onClick={(e) => {
          e.stopPropagation()
          handleMarkAsPlayed()
        }}
      />
      {latest && (
        <>
          <DropdownMenuSeparator />
          <OptionsButtons.GotoPodcast
            variant="dropdown"
            type="episode"
            onClick={(e) => {
              e.stopPropagation()
              gotoEpisode()
            }}
          />
          <OptionsButtons.GotoPodcast
            variant="dropdown"
            type="podcast"
            onClick={(e) => {
              e.stopPropagation()
              gotoPodcast()
            }}
          />
        </>
      )}
      <DropdownMenuSeparator />
      <OptionsButtons.Download
        variant="dropdown"
        onClick={(e) => {
          e.stopPropagation()
          handleDownload()
        }}
      />
    </>
  )
}
