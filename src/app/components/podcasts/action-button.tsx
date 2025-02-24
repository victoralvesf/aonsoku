import clsx from 'clsx'
import { EllipsisVertical } from 'lucide-react'
import { OptionsButtons } from '@/app/components/options/buttons'
import { Button } from '@/app/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu'
import { useEpisodeQueue } from '@/app/hooks/use-podcast-playing'
import { Episode } from '@/types/responses/podcasts'

interface PodcastActionButtonProps {
  episode: Episode
  featured?: boolean
}

export function PodcastActionButton({
  episode,
  featured = false,
}: PodcastActionButtonProps) {
  const { handlePlayNext, handlePlayLast } = useEpisodeQueue({ id: episode.id })

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
        <DropdownMenuItem>Marcar como reproduzido</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Ir para o episódio</DropdownMenuItem>
        <DropdownMenuItem>Ir para o podcast</DropdownMenuItem>
        <DropdownMenuSeparator />
        <OptionsButtons.Download />
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
