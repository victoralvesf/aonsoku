import { memo } from 'react'
import { MiniPlayerButton } from '@/app/components/mini-player/button'
import { RadioInfo } from '@/app/components/player/radio-info'
import { TrackInfo } from '@/app/components/player/track-info'
import { useAppStore } from '@/store/app.store'
import {
  usePlayerMediaType,
  usePlayerSonglist,
} from '@/store/player.store'
import { hasPiPSupport } from '@/utils/browser'
import { PlayerClearQueueButton } from './clear-queue-button'
import { PlayerControls } from './controls'
import { PlayerExpandButton } from './expand-button'
import { PlayerLikeButton } from './like-button'
import { PlayerLyricsButton } from './lyrics-button'
import { PodcastInfo } from './podcast-info'
import { PodcastPlaybackRate } from './podcast-playback-rate'
import { PlayerProgress } from './progress'
import { PlayerQueueButton } from './queue-button'
import { PlayerVolume } from './volume'

const MemoTrackInfo = memo(TrackInfo)
const MemoRadioInfo = memo(RadioInfo)
const MemoPodcastInfo = memo(PodcastInfo)
const MemoPlayerControls = memo(PlayerControls)
const MemoPlayerProgress = memo(PlayerProgress)
const MemoPlayerLikeButton = memo(PlayerLikeButton)
const MemoPlayerQueueButton = memo(PlayerQueueButton)
const MemoPlayerClearQueueButton = memo(PlayerClearQueueButton)
const MemoPlayerVolume = memo(PlayerVolume)
const MemoPlayerExpandButton = memo(PlayerExpandButton)
const MemoPodcastPlaybackRate = memo(PodcastPlaybackRate)
const MemoLyricsButton = memo(PlayerLyricsButton)
const MemoMiniPlayerButton = memo(MiniPlayerButton)

export function Player() {
  const hideFavoritesSection = useAppStore().pages.hideFavoritesSection
  const { currentList, currentSongIndex, radioList, podcastList } =
    usePlayerSonglist()
  const { isSong, isRadio, isPodcast } = usePlayerMediaType()

  const song = currentList[currentSongIndex]
  const radio = radioList[currentSongIndex]
  const podcast = podcastList[currentSongIndex]

  return (
    <footer className="border-t h-[--player-height] w-full flex items-center fixed bottom-0 left-0 right-0 z-40 bg-background">
      <div className="w-full h-full grid grid-cols-player gap-2 px-4">
        {/* Track Info */}
        <div className="flex items-center gap-2 w-full">
          {isSong && <MemoTrackInfo song={song} />}
          {isRadio && <MemoRadioInfo radio={radio} />}
          {isPodcast && <MemoPodcastInfo podcast={podcast} />}
        </div>
        {/* Main Controls */}
        <div className="col-span-2 flex flex-col justify-center items-center px-4 gap-1">
          <MemoPlayerControls
            song={song}
            radio={radio}
            podcast={podcast}
          />

          {(isSong || isPodcast) && <MemoPlayerProgress />}
        </div>
        {/* Remain Controls and Volume */}
        <div className="flex items-center w-full justify-end">
          <div className="flex items-center gap-1">
            {isSong && !hideFavoritesSection && (
              <>
                <MemoPlayerLikeButton disabled={!song} />
              </>
            )}
            {isSong && (
              <>
                <MemoLyricsButton disabled={!song} />
                <MemoPlayerQueueButton disabled={!song} />
              </>
            )}
            {isPodcast && <MemoPodcastPlaybackRate />}
            {(isRadio || isPodcast) && (
              <MemoPlayerClearQueueButton disabled={!radio && !podcast} />
            )}

            <MemoPlayerVolume disabled={!song && !radio && !podcast} />

            {isSong && <MemoPlayerExpandButton disabled={!song} />}
            {isSong && hasPiPSupport && <MemoMiniPlayerButton />}
          </div>
        </div>
      </div>
    </footer>
  )
}
