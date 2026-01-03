import clsx from 'clsx'
import { Heart } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/app/components/ui/button'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'

import { useState } from 'react'

import { StarRating } from '@/app/components/ui/StarRating'

import {
  usePlayerActions,
  usePlayerSongStarred,
  usePlayerStore,
} from '@/store/player.store'
import { Tooltip, TooltipContent, TooltipTrigger } from '@radix-ui/react-tooltip'

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
  const [rating, setRating] = useState<number>(0)

  const translationLabel = `player.tooltips.${isSongStarred ? 'dislike' : 'like'}`
  const likeTooltip = t(translationLabel, { song, artist })

  /**
   * stars:
   * 0 - nothing
   * 1 - thin outline
   * 2 - thick outline
   * 3 - thin outline, half filled
   * 4 - filled
   * 5 - filled with sparkles
   */

  return (
    <Tooltip side='right'>
      <TooltipTrigger asChild>
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
      </TooltipTrigger>
      <TooltipContent side='right'>
        <StarRating value={rating} setValue={setRating} />
      </TooltipContent>
    </Tooltip>
  )
}
