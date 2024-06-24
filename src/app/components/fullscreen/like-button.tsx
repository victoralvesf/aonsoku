import { Heart } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { usePlayer } from '@/app/contexts/player-context'
import clsx from 'clsx'

export function LikeButton() {
  const player = usePlayer()

  return (
    <Button
      size="icon"
      variant="ghost"
      className="w-12 h-12 p-2 rounded-full"
      onClick={player.starCurrentSong}
    >
      <Heart
        className={clsx(
          'w-5 h-5',
          player.isSongStarred && 'text-red-500 fill-red-500',
        )}
      />
    </Button>
  )
}
