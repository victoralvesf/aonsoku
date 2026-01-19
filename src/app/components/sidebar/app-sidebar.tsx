import CommandMenu from '@/app/components/command/command-menu'
import {
  MainSidebar,
  MainSidebarContent,
  MainSidebarHeader,
  MainSidebarRail,
} from '@/app/components/ui/main-sidebar'
import { MiniSidebarSearch } from './mini-search'
import { SidebarMiniSeparator } from './mini-separator'
import { MobileCloseButton } from './mobile-close-button'
import { NavLibrary } from './nav-library'
import { NavMain } from './nav-main'

import { useEffect, useState, useRef, ComponentPropsWithoutRef } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import { Lrc } from 'react-lrc'
import { isSafari } from 'react-device-detect'
import clsx from 'clsx'
import {
  ScrollArea,
  scrollAreaViewportSelector,
} from '@/app/components/ui/scroll-area'
import { useLyricsState, usePlayerRef, usePlayerSonglist } from '@/store/player.store'
import { subsonic } from '@/service/subsonic'
import { ILyric } from '@/types/responses/song'


import { useMainSidebar } from '@/app/components/ui/main-sidebar'


interface LyricProps {
  lyrics: ILyric
}



function UnsyncedLyrics({ lyrics }: LyricProps) {
  const { currentSong } = usePlayerSonglist()
  const lyricsBoxRef = useRef<HTMLDivElement>(null)

  const lines = lyrics.value!.split('\n')

  // biome-ignore lint/correctness/useExhaustiveDependencies: recomputed when song changes
  useEffect(() => {
    if (lyricsBoxRef.current) {
      const scrollArea = lyricsBoxRef.current.querySelector(
        scrollAreaViewportSelector,
      ) as HTMLDivElement

      scrollArea.scrollTo({
        top: 0,
        behavior: 'smooth',
      })
    }
  }, [currentSong])

  return (
    <ScrollArea
      type="always"
      className="w-full h-full overflow-y-auto text-center font-semibold text-xl 2xl:text-2xl px-2 scroll-smooth maskImage-unsynced-lyrics"
      thumbClassName="secondary-thumb-bar"
      ref={lyricsBoxRef}
    >
      {lines.map((line, index) => (
        <p
          key={index}
          className={clsx(
            'leading-10 text-shadow-lg text-balance',
            index === 0 && 'mt-4',
            index === lines.length - 1 && 'mb-16',
          )}
        >
          {line}
        </p>
      ))}
    </ScrollArea>
  )
}



const LyricsSidebar = () => {
  const { currentSong } = usePlayerSonglist()
  const { t } = useTranslation()

  const { artist, title, duration } = currentSong

  const { data: lyrics, isLoading } = useQuery({
    queryKey: ['get-lyrics', artist, title, duration],
    queryFn: () =>
      subsonic.lyrics.getLyrics({
        artist,
        title,
        duration,
      }),
  })

  const noLyricsFound = t('fullscreen.noLyrics')
  const loadingLyrics = t('fullscreen.loadingLyrics')

  if (isLoading) {
    return <CenteredMessage>{loadingLyrics}</CenteredMessage>
  } else if (lyrics && lyrics.value) {
    return areLyricsSynced(lyrics) ? (
      <SyncedLyrics lyrics={lyrics} />
    ) : (
      <UnsyncedLyrics lyrics={lyrics} />
    )
  } else {
    return <CenteredMessage>{noLyricsFound}</CenteredMessage>
  }
}

export function AppSidebar({
  ...props
}: React.ComponentProps<typeof MainSidebar>) {

    const { lyricsState } = useLyricsState()
  const { state: sidebarState } = useMainSidebar()
  const sidebarOpen = sidebarState === 'expanded'


  return (
    <MainSidebar collapsible="icon" {...props}>
      <MobileCloseButton />
      <MainSidebarHeader>
        <CommandMenu />
      </MainSidebarHeader>
      <MiniSidebarSearch />
      <NavMain />
      <SidebarMiniSeparator />
      <MainSidebarContent className="max-h-fit flex-none overflow-x-clip">
        <NavLibrary />
      </MainSidebarContent>
      
      {lyricsState && sidebarOpen && <LyricsSidebar />}

      {/* <NavPlaylists /> */}
      <MainSidebarRail />
    </MainSidebar>
  )
}



function SyncedLyrics({ lyrics }: LyricProps) {
  const playerRef = usePlayerRef()
  const [progress, setProgress] = useState(0)

  setTimeout(() => {
    let newProgress = (playerRef?.currentTime || 0) * 1000

    if (newProgress === progress) {
      newProgress += 1 // Prevents the lyrics from getting stuck when the audio is still loading
    }

    setProgress(newProgress)
  }, 50)

  const skipToTime = (timeMs: number) => {
    if (playerRef) {
      playerRef!.currentTime = timeMs / 1000
    }
  }

  return (
    <div className="w-full h-full text-center font-semibold text-s px-2 lrc-box">
      <Lrc
        lrc={lyrics.value!}
        recoverAutoScrollInterval={1500}
        currentMillisecond={progress}
        id="sync-lyrics-box"
        className={clsx('h-full overflow-y-auto', !isSafari && 'scroll-smooth')}
        verticalSpace={true}
        lineRenderer={({ active, line }) => (
          <p
            onClick={() => skipToTime(line.startMillisecond)}
            className={clsx(
              'text-shadow-lg my-5 cursor-pointer hover:opacity-100 duration-500',
              'transition-[opacity,transform] motion-reduce:transition-none',
              active ? 'opacity-100 scale-125' : 'opacity-50',
            )}
          >
            {line.content}
          </p>
        )}
      />
    </div>
  )
}

type CenteredMessageProps = ComponentPropsWithoutRef<'p'>

function CenteredMessage({ children }: CenteredMessageProps) {
  return (
    <div className="w-full h-full flex justify-center items-center">
      <p className="leading-10 text-shadow-lg text-center font-semibold text-xl 2xl:text-2xl">
        {children}
      </p>
    </div>
  )
}

function areLyricsSynced(lyrics: ILyric) {
  // Most LRC files start with the string "[00:" or "[01:" indicating synced lyrics
  const lyric = lyrics.value?.trim() ?? ''
  return (
    lyric.startsWith('[00:') ||
    lyric.startsWith('[01:') ||
    lyric.startsWith('[02:')
  )
}

