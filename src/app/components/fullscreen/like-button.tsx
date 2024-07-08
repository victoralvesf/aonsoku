import { clsx } from 'clsx'
import { Heart } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { usePlayerActions, usePlayerState } from '@/store/player.store'

interface LikeButtonProps {
  className?: string
}

export function LikeButton({ className }: LikeButtonProps) {
  const { starCurrentSong } = usePlayerActions()
  const { isSongStarred } = usePlayerState()

  return (
    <Button
      size="icon"
      variant="ghost"
      className={className}
      onClick={starCurrentSong}
    >
      <Heart
        className={clsx(
          'w-6 h-6 drop-shadow-lg',
          isSongStarred && 'text-red-500 fill-red-500',
        )}
      />
    </Button>
  )
}
