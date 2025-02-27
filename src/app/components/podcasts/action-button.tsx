import clsx from 'clsx'
import { EllipsisVertical } from 'lucide-react'
import { OptionsButtons } from '@/app/components/options/buttons'
import { Button } from '@/app/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu'
import { usePodcastOptions } from '@/app/hooks/use-podcast-options'
import { useEpisodeQueue } from '@/app/hooks/use-podcast-playing'
import { Episode } from '@/types/responses/podcasts'

interface PodcastActionButtonProps {
  episode: Episode
  featured?: boolean
  latest?: boolean
}

export function PodcastActionButton({
  episode,
  featured = false,
  latest = false,
}: PodcastActionButtonProps) {
  const { handlePlayNext, handlePlayLast } = useEpisodeQueue({ id: episode.id })
  const { markAsPlayedMutation, gotoEpisode, gotoPodcast } = usePodcastOptions({
    episode,
  })

  function handleMarkAsPlayed() {
    markAsPlayedMutation.mutate()
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        asChild
        className="outline-none focus-visible:ring-0 focus-visible:ring-transparent ring-0 ring-offset-transparent"
      >
        <Button
          variant="ghost"
          size="icon"
          className={clsx(
            'w-8 h-8 p-1 rounded-full data-[state=open]:bg-accent',
            !featured && 'hover:bg-background',
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <EllipsisVertical className="w-3 h-3" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
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
        <OptionsButtons.Download />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
