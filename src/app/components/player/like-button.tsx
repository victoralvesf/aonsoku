import clsx from 'clsx'
import { Heart } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/app/components/ui/button'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'
import {
  usePlayerActions,
  usePlayerSongStarred,
  usePlayerStore,
} from '@/store/player.store'

interface PlayerLikeButtonProps {
  disabled: boolean
}

export function PlayerLikeButton({ disabled }: PlayerLikeButtonProps) {
  const { t } = useTranslation()
  const isSongStarred = usePlayerSongStarred()
  const { title: song, artist } = usePlayerStore(
    (state) => state.songlist.currentSong,
  )
  const { starCurrentSong } = usePlayerActions()

  const translationLabel = `player.tooltips.${isSongStarred ? 'dislike' : 'like'}`
  const likeTooltip = t(translationLabel, { song, artist })

  return (
    <SimpleTooltip text={likeTooltip}>
      <Button
        variant="ghost"
        className="rounded-full w-10 h-10 p-3 text-secondary-foreground"
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
    </SimpleTooltip>
  )
}
