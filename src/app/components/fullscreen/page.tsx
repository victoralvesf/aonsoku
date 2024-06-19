import { ReactNode, useCallback, useEffect, useState } from 'react'

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTrigger,
} from '@/app/components/ui/drawer'

import { Card } from '@/app/components/ui/card'
import { usePlayer } from '@/app/contexts/player-context'
import { getCoverArtUrl } from '@/api/httpClient'

import { subsonic } from '@/service/subsonic'
import FullscreenBackdrop from './backdrop'
import { CloseFullscreenButton, SwitchThemeButton } from './buttons'
import { SongInfo } from './song-info'
import { FullscreenPlayer } from './player'
import { FullscreenTabs } from './tabs'
import { useTranslation } from 'react-i18next'

interface FullscreenModeProps {
  children: ReactNode
}

export default function FullscreenMode({ children }: FullscreenModeProps) {
  const { t } = useTranslation()

  const noLyricsFound = t('fullscreen.noLyrics')

  const [currentLyrics, setCurrentLyrics] = useState(noLyricsFound)
  const { currentSongList, currentSongIndex } = usePlayer()

  const song = currentSongList[currentSongIndex]

  const getLyrics = useCallback(async () => {
    const response = await subsonic.songs.getLyrics(song.artist, song.title)

    if (response) {
      setCurrentLyrics(response.value || noLyricsFound)
    }
  }, [song, noLyricsFound])

  useEffect(() => {
    if (song) getLyrics()
  }, [song, getLyrics])

  if (!song) return <></>

  const songCoverArtUrl = getCoverArtUrl(song.coverArt, '1000')

  return (
    <Drawer
      fixed
      dismissible={false}
      handleOnly={true}
      disablePreventScroll={true}
    >
      <DrawerTrigger asChild>{children}</DrawerTrigger>
      <DrawerContent
        className="h-screen w-screen rounded-t-none border-none select-none cursor-default"
        showHandle={false}
      >
        <FullscreenBackdrop imageUrl={songCoverArtUrl}>
          <div className="p-8 w-full h-full grid grid-rows-[40px_minmax(300px,_1fr)_150px] gap-4">
            {/* First Row */}
            <div className="flex justify-between items-center">
              <DrawerClose>
                <CloseFullscreenButton />
              </DrawerClose>

              <SwitchThemeButton />
            </div>

            {/* Second Row */}
            <div className="flex flex-col">
              <div className="grid grid-cols-12 min-h-[300px] h-full">
                <div className="col-start-2 col-span-5 max-w-full">
                  <SongInfo
                    imageUrl={songCoverArtUrl}
                    songTitle={song.title}
                    artist={song.artist}
                  />
                </div>

                <Card className="overflow-hidden bg-background/70 col-start-7 col-span-5 rounded-2xl p-6 shadow-lg shadows-4 shadow-opacity-5 shadow-y-[3px] shadows-scale-3">
                  <FullscreenTabs lyrics={currentLyrics} />
                </Card>
              </div>
            </div>

            {/* Third Row */}
            <div className="grid grid-cols-12">
              <div className="col-start-2 col-span-10 flex items-center">
                <FullscreenPlayer />
              </div>
            </div>
          </div>
        </FullscreenBackdrop>
      </DrawerContent>
    </Drawer>
  )
}
