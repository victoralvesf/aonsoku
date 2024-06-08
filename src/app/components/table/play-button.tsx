import { useMemo } from 'react'
import { PauseIcon, PlayIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { usePlayer } from "@/app/contexts/player-context"
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'
import { Button } from "@/app/components/ui/button"
import Image from "@/app/components/image"

interface PlaySongButtonProps {
  trackNumber: number
  trackId: string
  handlePlayButton: () => void
  type: 'song' | 'radio'
  title: string
  artist?: string
}

interface Tooltips {
  playTooltip: string
  pauseTooltip: string
}

export default function PlaySongButton({
  trackNumber,
  trackId,
  handlePlayButton,
  type,
  title,
  artist = ''
}: PlaySongButtonProps) {
  const player = usePlayer()
  const { t } = useTranslation()

  const isCurrentSongPlaying = () => {
    if (player.mediaType === 'song') {
      return player.checkActiveSong(trackId)
    } else {
      return player.radioList[player.currentSongIndex].id === trackId
    }
  }


  const tooltips = useMemo(() => {
    const tooltips = {} as Tooltips

    if (type === 'song') {
      tooltips.playTooltip = t('table.buttons.play', { title: title, artist: artist })
      tooltips.pauseTooltip = t('table.buttons.pause', { title: title, artist: artist })
    } else {
      tooltips.playTooltip = t('radios.table.playTooltip', { name: title })
      tooltips.pauseTooltip = t('radios.table.pauseTooltip', { name: title })
    }

    return tooltips
  }, [player.currentSongList])


  return (
    <div className="text-center text-foreground flex justify-center">
      {(isCurrentSongPlaying() && !player.isPlaying) && (
        <div className="w-8 flex items-center">
          <SimpleTooltip text={tooltips.playTooltip}>
            <Button
              className="w-8 h-8 rounded-full group hover:bg-white dark:hover:bg-slate-950 hover:shadow-sm"
              size="icon"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                player.togglePlayPause()
              }}
            >
              <PlayIcon className="w-3 h-3 opacity-80 group-hover:opacity-100 fill-inherit dark:fill-slate-50" strokeWidth={4} />
            </Button>
          </SimpleTooltip>
        </div>
      )}
      {(isCurrentSongPlaying() && player.isPlaying) && (
        <>
          <div className="group-hover/tablerow:hidden w-8 flex items-center">
            <div className="w-8 h-8 overflow-hidden rounded-full">
              <Image src="/sound-motion.gif" className="ml-[3px] mt-[7px] dark:invert w-6 h-4 opacity-70" />
            </div>
          </div>
          <div className="hidden group-hover/tablerow:flex justify-center">
            <SimpleTooltip text={tooltips.pauseTooltip}>
              <Button
                className="w-8 h-8 rounded-full group hover:bg-white dark:hover:bg-slate-950 hover:shadow-sm"
                size="icon"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation()
                  player.togglePlayPause()
                }}
              >
                <PauseIcon className="w-4 h-4 opacity-80 group-hover:opacity-100 fill-inherit dark:fill-slate-50" strokeWidth={1} />
              </Button>
            </SimpleTooltip>
          </div>
        </>
      )}
      {!isCurrentSongPlaying() && (
        <>
          <div className="group-hover/tablerow:hidden w-8">
            {trackNumber}
          </div>
          <div className="hidden group-hover/tablerow:flex justify-center">
            <SimpleTooltip text={tooltips.playTooltip}>
              <Button
                className="w-8 h-8 rounded-full group hover:bg-white dark:hover:bg-slate-950 hover:shadow-sm"
                size="icon"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation()
                  handlePlayButton()
                }}
              >
                <PlayIcon className="w-3 h-3 opacity-80 group-hover:opacity-100 fill-inherit dark:fill-slate-50" strokeWidth={4} />
              </Button>
            </SimpleTooltip>
          </div>
        </>
      )}
    </div>
  )
}