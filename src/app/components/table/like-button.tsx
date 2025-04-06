import { clsx } from 'clsx'
import { Heart } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/app/components/ui/button'
import { subsonic } from '@/service/subsonic'
import {
  usePlayerActions,
  usePlayerMediaType,
  usePlayerSongStarred,
  usePlayerSonglist,
} from '@/store/player.store'

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
  const { currentSong } = usePlayerSonglist()
  const isSongStarred = usePlayerSongStarred()
  const { isRadio, isSong } = usePlayerMediaType()
  const { starCurrentSong, starSongInQueue } = usePlayerActions()

  useEffect(() => {
    if (type === 'artist') return
    if (isRadio) return

    const isSongPlaying = currentSong.id === entityId

    if (isSongPlaying) setIsStarred(isSongStarred)
  }, [currentSong, entityId, isSongStarred, isRadio, type])

  async function handleStarred() {
    const state = !isStarred

    await subsonic.star.handleStarItem({
      id: entityId,
      starred: isStarred,
    })
    setIsStarred(state)

    if (type === 'song' && isSong) {
      const isSongPlaying = currentSong.id === entityId
      isSongPlaying ? starCurrentSong() : starSongInQueue(entityId)
    }
  }

  return (
    <Button
      variant="ghost"
      className={clsx(
        'w-8 h-8 p-1 rounded-full transition-opacity hover:bg-background/80',
        !isStarred && 'opacity-0 group-hover/tablerow:opacity-100',
      )}
      onClick={(e) => {
        e.stopPropagation()
        handleStarred()
      }}
    >
      <Heart
        className={clsx('w-4 h-4', isStarred && 'text-red-500 fill-red-500')}
        strokeWidth={2}
      />
    </Button>
  )
}
