import { PauseIcon, PlayIcon } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import { EqualizerBars } from '@/app/components/icons/equalizer-bars'
import { Button } from '@/app/components/ui/button'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'
import {
  usePlayerActions,
  usePlayerIsPlaying,
  usePlayerMediaType,
  usePlayerSonglist,
} from '@/store/player.store'

interface PlaySongButtonProps {
  trackNumber: number
  trackId: string
  handlePlayButton: () => void
  type: 'song' | 'radio' | 'artist' | 'playlist'
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
  artist = '',
}: PlaySongButtonProps) {
  const { checkActiveSong, togglePlayPause } = usePlayerActions()
  const mediaType = usePlayerMediaType()
  const isPlaying = usePlayerIsPlaying()
  const { radioList, currentSongIndex } = usePlayerSonglist()
  const { t } = useTranslation()

  const isCurrentSongPlaying = () => {
    if (mediaType === 'song') {
      return checkActiveSong(trackId)
    }
    if (mediaType === 'radio') {
      return radioList[currentSongIndex].id === trackId
    }

    return false
  }

  const tooltips = useMemo(() => {
    const tooltips = {} as Tooltips

    if (type === 'song') {
      tooltips.playTooltip = t('table.buttons.play', {
        title,
        artist,
      })
      tooltips.pauseTooltip = t('table.buttons.pause', {
        title,
        artist,
      })
    }
    if (type === 'radio') {
      tooltips.playTooltip = t('radios.table.playTooltip', { name: title })
      tooltips.pauseTooltip = t('radios.table.pauseTooltip', { name: title })
    }
    if (type === 'artist') {
      tooltips.playTooltip = t('artist.buttons.play', { artist: title })
      tooltips.pauseTooltip = ''
    }
    if (type === 'playlist') {
      tooltips.playTooltip = t('playlist.buttons.play', { name: title })
      tooltips.pauseTooltip = ''
    }

    return tooltips
  }, [artist, t, title, type])

  return (
    <div className="w-full h-full text-center text-foreground flex items-center justify-center">
      {isCurrentSongPlaying() && !isPlaying && (
        <div className="w-8 flex items-center">
          <SimpleTooltip text={tooltips.playTooltip}>
            <Button
              className="w-8 h-8 rounded-full group hover:bg-background hover:shadow-sm border-0"
              size="icon"
              variant="outline"
              onClick={(e) => {
                e.stopPropagation()
                togglePlayPause()
              }}
            >
              <PlayIcon
                className="w-3 h-3 opacity-70 group-hover:opacity-100 text-foreground fill-foreground transition-opacity"
                strokeWidth={4}
              />
            </Button>
          </SimpleTooltip>
        </div>
      )}
      {isCurrentSongPlaying() && isPlaying && (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute opacity-100 group-hover/tablerow:opacity-0 w-8 h-8 flex items-center">
            <div className="w-8 h-8 flex items-center justify-center">
              <EqualizerBars width={18} height={18} className="text-primary" />
            </div>
          </div>
          <div className="absolute opacity-0 group-hover/tablerow:opacity-100 flex justify-center">
            <SimpleTooltip text={tooltips.pauseTooltip}>
              <Button
                className="w-8 h-8 rounded-full group hover:bg-background hover:shadow-sm border-0"
                size="icon"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation()
                  togglePlayPause()
                }}
              >
                <PauseIcon
                  className="w-4 h-4 opacity-70 group-hover:opacity-100 text-foreground fill-foreground transition-opacity"
                  strokeWidth={1}
                />
              </Button>
            </SimpleTooltip>
          </div>
        </div>
      )}
      {!isCurrentSongPlaying() && (
        <>
          <div className="group-hover/tablerow:hidden w-8 h-8 flex items-center justify-center">
            {trackNumber}
          </div>
          <div className="hidden group-hover/tablerow:block">
            <SimpleTooltip text={tooltips.playTooltip}>
              <Button
                className="w-8 h-8 rounded-full group hover:bg-background hover:shadow-sm border-0"
                size="icon"
                variant="outline"
                onClick={(e) => {
                  e.stopPropagation()
                  handlePlayButton()
                }}
              >
                <PlayIcon
                  className="w-3 h-3 opacity-70 group-hover:opacity-100 text-foreground fill-foreground transition-opacity"
                  strokeWidth={4}
                />
              </Button>
            </SimpleTooltip>
          </div>
        </>
      )}
    </div>
  )
}
