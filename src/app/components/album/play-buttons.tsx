import { useState } from "react";
import clsx from "clsx";
import { EllipsisVertical, Heart, Play, Shuffle } from "lucide-react";

import { Button } from "@/app/components/ui/button";
import { SimpleTooltip } from "@/app/components/ui/simple-tooltip";
import { subsonic } from "@/service/subsonic";

interface PlayButtonsProps {
  playButtonTooltip: string
  handlePlayButton: () => void
  shuffleButtonTooltip: string
  handleShuffleButton: () => void
  optionsTooltip: string
  showLikeButton?: boolean
  likeTooltipResource?: string
  likeState?: string
  contentId?: string
}

export default function PlayButtons({
  playButtonTooltip,
  handlePlayButton,
  shuffleButtonTooltip,
  handleShuffleButton,
  optionsTooltip,
  showLikeButton = false,
  likeTooltipResource,
  likeState,
  contentId
}: PlayButtonsProps) {
  const [isStarred, setIsStarred] = useState(likeState ? true : false)

  async function handleLikeButton() {
    if (!contentId) return

    if (isStarred) {
      await subsonic.star.unstarItem(contentId)
      setIsStarred(false)
    } else {
      await subsonic.star.starItem(contentId)
      setIsStarred(true)
    }
  }

  return (
    <div className="w-full mb-6 mt-6 flex items-center gap-2">
      <SimpleTooltip text={playButtonTooltip}>
        <Button
          className="rounded-full w-14 h-14 hover:scale-[0.97] transform-gpu"
          variant="default"
          onClick={handlePlayButton}
        >
          <Play className="w-4 h-4 fill-slate-50 text-slate-50" strokeWidth={6} />
        </Button>
      </SimpleTooltip>

      <SimpleTooltip text={shuffleButtonTooltip}>
        <Button
          className="rounded-full w-12 h-12"
          variant="ghost"
          onClick={handleShuffleButton}
        >
          <Shuffle className="w-4 h-4" strokeWidth={2} />
        </Button>
      </SimpleTooltip>

      {showLikeButton && likeTooltipResource && (
        <SimpleTooltip text={`${isStarred ? 'Remove like from' : 'Like'} ${likeTooltipResource}`}>
          <Button
            className="rounded-full w-12 h-12"
            variant="ghost"
            onClick={handleLikeButton}
          >
            <Heart
              className={clsx("w-4 h-4", isStarred && "text-red-500 fill-red-500")}
              strokeWidth={2}
            />
          </Button>
        </SimpleTooltip>
      )}

      <SimpleTooltip text={optionsTooltip}>
        <Button className="rounded-full w-12 h-12" variant="ghost">
          <EllipsisVertical className="w-4 h-4" strokeWidth={2} />
        </Button>
      </SimpleTooltip>
    </div>
  )
}