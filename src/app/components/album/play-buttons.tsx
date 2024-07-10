import { clsx } from 'clsx'
import { EllipsisVertical, Heart, Play, Shuffle } from 'lucide-react'
import { ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button } from '@/app/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'
import { subsonic } from '@/service/subsonic'

interface PlayButtonsProps {
  playButtonTooltip: string
  handlePlayButton: () => void
  disablePlayButton?: boolean
  shuffleButtonTooltip: string
  handleShuffleButton: () => void
  disableShuffleButton?: boolean
  optionsTooltip: string
  showLikeButton?: boolean
  likeTooltipResource?: string
  likeState?: string
  contentId?: string
  optionsMenuItems?: ReactNode
}

export default function PlayButtons({
  playButtonTooltip,
  handlePlayButton,
  disablePlayButton = false,
  shuffleButtonTooltip,
  handleShuffleButton,
  disableShuffleButton = false,
  optionsTooltip,
  showLikeButton = false,
  likeTooltipResource,
  likeState,
  contentId,
  optionsMenuItems,
}: PlayButtonsProps) {
  const [isStarred, setIsStarred] = useState(!!likeState)
  const { t } = useTranslation()

  async function handleLikeButton() {
    if (!contentId) return

    await subsonic.star.handleStarItem(contentId, isStarred)
    setIsStarred(!isStarred)
  }

  function likeTooltipText() {
    const albumName = { name: likeTooltipResource }
    if (isStarred) {
      return t('album.buttons.dislike', albumName)
    } else {
      return t('album.buttons.like', albumName)
    }
  }

  return (
    <div className="w-full my-6 flex items-center gap-1">
      <SimpleTooltip text={playButtonTooltip}>
        <Button
          className="rounded-full w-14 h-14 hover:scale-[0.97] transform-gpu"
          variant="default"
          onClick={handlePlayButton}
          disabled={disablePlayButton}
        >
          <Play
            className="w-5 h-5 fill-slate-50 text-slate-50"
            strokeWidth={6}
          />
        </Button>
      </SimpleTooltip>

      <SimpleTooltip text={shuffleButtonTooltip}>
        <Button
          className="rounded-full w-14 h-14"
          variant="ghost"
          onClick={handleShuffleButton}
          disabled={disableShuffleButton}
        >
          <Shuffle className="w-5 h-5" strokeWidth={2} />
        </Button>
      </SimpleTooltip>

      {showLikeButton && likeTooltipResource && (
        <SimpleTooltip text={likeTooltipText()}>
          <Button
            className="rounded-full w-14 h-14"
            variant="ghost"
            onClick={handleLikeButton}
          >
            <Heart
              className={clsx(
                'w-5 h-5',
                isStarred && 'text-red-500 fill-red-500',
              )}
              strokeWidth={2}
            />
          </Button>
        </SimpleTooltip>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger
          asChild
          className="outline-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:ring-transparent focus:ring-transparent"
        >
          <Button
            className="rounded-full w-14 h-14 data-[state=open]:bg-accent"
            variant="ghost"
            onClick={handleLikeButton}
          >
            <SimpleTooltip text={optionsTooltip}>
              <div className="min-w-14 h-14 rounded-full flex justify-center items-center">
                <EllipsisVertical className="w-5 h-5" strokeWidth={2} />
              </div>
            </SimpleTooltip>
          </Button>
        </DropdownMenuTrigger>
        {optionsMenuItems && (
          <DropdownMenuContent className="min-w-56" align="start">
            {optionsMenuItems}
          </DropdownMenuContent>
        )}
      </DropdownMenu>
    </div>
  )
}
