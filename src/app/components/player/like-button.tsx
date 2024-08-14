import clsx from 'clsx'
import { Heart } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { usePlayerActions, usePlayerSongStarred } from '@/store/player.store'

interface PlayerLikeButtonProps {
  disabled: boolean
}

export function PlayerLikeButton({ disabled }: PlayerLikeButtonProps) {
  const isSongStarred = usePlayerSongStarred()
  const { starCurrentSong } = usePlayerActions()

  return (
    <Button
      variant="ghost"
      className="rounded-full w-10 h-10 p-3"
      disabled={disabled}
      onClick={starCurrentSong}
      data-testid="player-like-button"
    >
      <Heart
        className={clsx(
          'w-5 h-5',
          isSongStarred && 'text-red-500 fill-red-500',
        )}
        data-testid="player-like-icon"
      />
    </Button>
  )
}
