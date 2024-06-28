import { useEffect, useState } from 'react'
import clsx from 'clsx'
import { Heart } from 'lucide-react'

import { Button } from '@/app/components/ui/button'
import { subsonic } from '@/service/subsonic'
import { usePlayer } from '@/app/contexts/player-context'

interface TableLikeButtonProps {
  type: 'song' | 'artist'
  starred: boolean
  entityId: string
}

export function TableLikeButton({
  entityId,
  starred,
  type,
}: TableLikeButtonProps) {
  const [isStarred, setIsStarred] = useState(starred)
  const { checkActiveSong, isSongStarred, starCurrentSong, starSongInQueue } =
    usePlayer()

  useEffect(() => {
    if (type === 'artist') return

    const isSongPlaying = checkActiveSong(entityId)

    if (isSongPlaying) setIsStarred(isSongStarred)
  }, [checkActiveSong, entityId, isSongStarred, type])

  async function handleStarred() {
    const state = !isStarred

    await subsonic.star.handleStarItem(entityId, isStarred)
    setIsStarred(state)

    if (type === 'song') {
      const isSongPlaying = checkActiveSong(entityId)
      isSongPlaying ? starCurrentSong() : starSongInQueue(entityId)
    }
  }

  return (
    <Button
      variant="ghost"
      className="rounded-full w-8 h-8 p-1 hover:border hover:bg-white dark:hover:bg-slate-950 hover:shadow-sm"
      onClick={handleStarred}
    >
      <Heart
        className={clsx('w-4 h-4', isStarred && 'text-red-500 fill-red-500')}
        strokeWidth={2}
      />
    </Button>
  )
}
