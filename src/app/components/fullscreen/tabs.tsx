import clsx from 'clsx'
import { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs'
import { isMac } from '@/utils/osType'
import { LyricsTab } from './lyrics'
import { FullscreenSongQueue } from './queue'
import { SongInfo } from './song-info'

const MemoSongQueue = memo(FullscreenSongQueue)
const MemoSongInfo = memo(SongInfo)
const MemoLyricsTab = memo(LyricsTab)

enum TabsEnum {
  Queue = 'queue',
  Playing = 'playing',
  Lyrics = 'lyrics',
}

type TabValue = TabsEnum

const getTransform = (currentTab: TabValue, tabValue: TabValue) => {
  const positions = {
    queue: {
      queue: '0',
      playing: '-120%',
      lyrics: '-240%',
    },
    playing: {
      queue: '120%',
      playing: '0',
      lyrics: '-120%',
    },
    lyrics: {
      queue: '240%',
      playing: '120%',
      lyrics: '0',
    },
  }

  const translation = positions[tabValue][currentTab]
  return `translate3d(${translation}, 0, 0)`
}

export function FullscreenTabs() {
  const [tab, setTab] = useState<TabValue>(TabsEnum.Playing)
  const { t } = useTranslation()

  const baseTabStyles = clsx(
    'absolute inset-0 mt-0 h-[calc(100%-64px)] overflow-y-auto transition-transform duration-300 will-change-transform',
    isMac && 'will-change-transform',
  )

  const baseTabTriggerStyles =
    'w-full data-[state=active]:bg-foreground data-[state=active]:text-secondary text-foreground'

  return (
    <Tabs
      value={tab}
      onValueChange={(value) => setTab(value as TabValue)}
      className="w-full h-full min-h-full"
    >
      <TabsList className="w-full bg-background/30 mb-4">
        <TabsTrigger value={TabsEnum.Queue} className={baseTabTriggerStyles}>
          {t('fullscreen.queue')}
        </TabsTrigger>
        <TabsTrigger value={TabsEnum.Playing} className={baseTabTriggerStyles}>
          {t('fullscreen.playing')}
        </TabsTrigger>
        <TabsTrigger value={TabsEnum.Lyrics} className={baseTabTriggerStyles}>
          {t('fullscreen.lyrics')}
        </TabsTrigger>
      </TabsList>
      <div className="relative w-full h-full">
        <TabsContent
          value={TabsEnum.Queue}
          className={baseTabStyles}
          style={{
            backfaceVisibility: 'hidden',
            transform: getTransform(tab, TabsEnum.Queue),
          }}
          forceMount={true}
        >
          <MemoSongQueue />
        </TabsContent>
        <TabsContent
          value={TabsEnum.Playing}
          className={clsx(baseTabStyles, 'overflow-hidden')}
          style={{
            backfaceVisibility: 'hidden',
            transform: getTransform(tab, TabsEnum.Playing),
          }}
          forceMount={true}
        >
          <MemoSongInfo />
        </TabsContent>
        <TabsContent
          value={TabsEnum.Lyrics}
          className={baseTabStyles}
          style={{
            backfaceVisibility: 'hidden',
            transform: getTransform(tab, TabsEnum.Lyrics),
          }}
          forceMount={true}
        >
          <MemoLyricsTab />
        </TabsContent>
      </div>
    </Tabs>
  )
}
