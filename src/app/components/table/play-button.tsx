import { PauseIcon, PlayIcon } from 'lucide-react'
import { EqualizerBars } from '@/app/components/icons/equalizer-bars'
import { Button } from '@/app/components/ui/button'
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
}

export default function PlaySongButton({
  trackNumber,
  trackId,
  handlePlayButton,
}: PlaySongButtonProps) {
  const { checkActiveSong, togglePlayPause } = usePlayerActions()
  const { isSong, isRadio } = usePlayerMediaType()
  const isPlaying = usePlayerIsPlaying()
  const { radioList, currentSongIndex } = usePlayerSonglist()

  const isCurrentSongPlaying = () => {
    if (isSong) {
      return checkActiveSong(trackId)
    }
    if (isRadio) {
      return radioList[currentSongIndex].id === trackId
    }

    return false
  }

  return (
    <div className="w-full h-full text-center text-foreground flex items-center justify-center">
      {isCurrentSongPlaying() && !isPlaying && (
        <div className="w-8 flex items-center">
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
        </div>
      )}
      {isCurrentSongPlaying() && isPlaying && (
        <div className="relative w-full h-full flex items-center justify-center">
          <div className="absolute opacity-100 group-hover/tablerow:opacity-0 w-8 h-8 flex items-center">
            <div className="w-8 h-8 flex items-center justify-center">
              <EqualizerBars size={18} className="mb-1" />
            </div>
          </div>
          <div className="absolute opacity-0 group-hover/tablerow:opacity-100 flex justify-center">
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
          </div>
        </div>
      )}
      {!isCurrentSongPlaying() && (
        <>
          <div className="group-hover/tablerow:hidden w-8 h-8 flex items-center justify-center">
            {trackNumber}
          </div>
          <div className="hidden group-hover/tablerow:block">
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
          </div>
        </>
      )}
    </div>
  )
}
