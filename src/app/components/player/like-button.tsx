import clsx from 'clsx'
import { Heart } from 'lucide-react'
import { Star, ThumbsDown, StarHalf } from 'lucide-react'
import { Button } from '@/app/components/ui/button'

import { useState } from 'react'

import {
  usePlayerActions,
  usePlayerSongStarred,
} from '@/store/player.store'
import { Tooltip, TooltipContent, TooltipTrigger } from '@radix-ui/react-tooltip'

interface PlayerLikeButtonProps {
  disabled: boolean
}

export function PlayerLikeButton({ disabled }: PlayerLikeButtonProps) {
  const isSongFavourited = usePlayerSongStarred()
  const { starCurrentSong } = usePlayerActions()
  const [rating, setRating] = useState<number>(0)

  
const StarSelector = ({ value, setValue }: { value: number, setValue: (value: number) => void }) => {
  return (
    <div className='flex items-start gap-0 bg-gray-800 rounded p-1'>
      <Star onClick={() => setValue(1)} size={16} fill={value>0 ? "#fffb00" : "none"}/>
      <Star onClick={() => setValue(2)} size={16} fill={value>1 ? "#fffb00" : "none"}/>  
      <Star onClick={() => setValue(3)} size={16} fill={value>2 ? "#fffb00" : "none"}/>
      <Star onClick={() => setValue(4)} size={16} fill={value>3 ? "#fffb00" : "none"}/>
      <Star onClick={() => setValue(5)} size={16} fill={value>4 ? "#fffb00" : "none"}/>
    </div>
  )
}

  const StarOverview = () => {
    switch (rating) {
      case 0:
        return <Star size={16} />
      case 1:
        return <ThumbsDown size={16} color="#fffb00" />
      case 2:
        return <StarHalf size={16} color="#fffb00"  />
      case 3:
        return <Star size={16} color="#fffb00" />
      case 4:
        return (
          <>
            <Star size={16} strokeWidth={2} className="absolute z-index-1" color="#fffb00" />
            <StarHalf size={16} strokeWidth={2} className="absolute z-index-2" color="#fffb00" fill="#fffb00" />
          </>
        )
      case 5:
        return <Star size={16} color="#fffb00" fill="#fffb00" />
      }
  }  
  return (
    <>
      <Button
          variant="ghost"
          className="rounded-full w-10 h-10 p-3 text-secondary-foreground"
          disabled={disabled}
          onClick={starCurrentSong}
          data-testid="player-like-button" >
          <Heart
            className={clsx('w-5 h-5', isSongFavourited && 'text-red-500 fill-red-500',)}
            data-testid="player-like-icon" />
        </Button>
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="ghost"
          className="rounded-full w-10 h-10 p-3"
          disabled={disabled}
          onClick={() => setRating(0)}
          data-testid="player-like-button" >
          <StarOverview />
        </Button>
      </TooltipTrigger>
      <TooltipContent side='left'>
        <StarSelector value={rating} setValue={setRating} />
      </TooltipContent>
    </Tooltip>
    </>
  )
}
