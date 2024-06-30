import { ReactNode, useState } from 'react'
import clsx from 'clsx'
import { EllipsisVertical, Heart, Play, Shuffle } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu'

import { Button } from '@/app/components/ui/button'
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
    <div className="w-full mb-6 mt-6 flex items-center gap-2">
      <SimpleTooltip text={playButtonTooltip}>
        <Button
          className="rounded-full w-14 h-14 hover:scale-[0.97] transform-gpu"
          variant="default"
          onClick={handlePlayButton}
          disabled={disablePlayButton}
        >
          <Play
            className="w-4 h-4 fill-slate-50 text-slate-50"
            strokeWidth={6}
          />
        </Button>
      </SimpleTooltip>

      <SimpleTooltip text={shuffleButtonTooltip}>
        <Button
          className="rounded-full w-12 h-12"
          variant="ghost"
          onClick={handleShuffleButton}
          disabled={disableShuffleButton}
        >
          <Shuffle className="w-4 h-4" strokeWidth={2} />
        </Button>
      </SimpleTooltip>

      {showLikeButton && likeTooltipResource && (
        <SimpleTooltip text={likeTooltipText()}>
          <Button
            className="rounded-full w-12 h-12"
            variant="ghost"
            onClick={handleLikeButton}
          >
            <Heart
              className={clsx(
                'w-4 h-4',
                isStarred && 'text-red-500 fill-red-500',
              )}
              strokeWidth={2}
            />
          </Button>
        </SimpleTooltip>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-full w-12 h-12 data-[state=open]:bg-accent">
          <SimpleTooltip text={optionsTooltip}>
            <div className="min-w-12 h-12 rounded-full flex justify-center items-center">
              <EllipsisVertical className="w-4 h-4" strokeWidth={2} />
            </div>
          </SimpleTooltip>
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
