import { Heart } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { usePlayer } from '@/app/contexts/player-context'
import clsx from 'clsx'

interface LikeButtonProps {
  className?: string
}

export function LikeButton({ className }: LikeButtonProps) {
  const player = usePlayer()

  return (
    <Button
      size="icon"
      variant="ghost"
      className={className}
      onClick={player.starCurrentSong}
    >
      <Heart
        className={clsx(
          'w-6 h-6',
          player.isSongStarred && 'text-red-500 fill-red-500',
        )}
      />
    </Button>
  )
}
