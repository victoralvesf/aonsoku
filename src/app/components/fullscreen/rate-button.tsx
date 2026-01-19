import { clsx } from 'clsx'
import { Star } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { usePlayerActions, usePlayerSongStarred } from '@/store/player.store'
import { buttonsStyle } from './controls'

export function RateButton() {
  const { starCurrentSong } = usePlayerActions()
  const isSongStarred = usePlayerSongStarred()

  return (
    <Button
      size="icon"
      variant="ghost"
      className={buttonsStyle.secondary}
      onClick={starCurrentSong}
      style={{ ...buttonsStyle.style }}
    >
      <Star
        className={clsx(
          'w-6 h-6 drop-shadow-lg',
          isSongStarred && 'text-red-500 fill-red-500',
        )}
      />
    </Button>
  )
}
