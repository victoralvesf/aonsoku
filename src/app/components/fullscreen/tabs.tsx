import { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs'
import { SongInfo } from './song-info'
import { LyricsTab } from './lyrics'
import { FullscreenSongQueue } from './queue'

const MemoSongInfo = memo(SongInfo)
const MemoLyricsTab = memo(LyricsTab)
const MemoSongQueue = memo(FullscreenSongQueue)

enum TabsEnum {
  Playing = 'playing',
  Lyrics = 'lyrics',
  Queue = 'queue',
}

type TabValue = TabsEnum

const getTransform = (currentTab: TabValue, tabValue: TabValue) => {
  const positions = {
    playing: {
      playing: '0',
      lyrics: '-120%',
      queue: '-240%',
    },
    lyrics: {
      playing: '120%',
      lyrics: '0',
      queue: '-120%',
    },
    queue: {
      playing: '240%',
      lyrics: '120%',
      queue: '0',
    },
  }

  const translation = positions[tabValue][currentTab]
  return `translate3d(${translation}, 0, 0)`
}

const tabStyles =
  'absolute inset-0 mt-0 h-[calc(100%-64px)] overflow-y-auto transition-transform duration-300'

const triggerStyles =
  'w-full data-[state=active]:bg-foreground data-[state=active]:text-secondary text-foreground drop-shadow-sm'

export function FullscreenTabs() {
  const [tab, setTab] = useState<TabValue>(TabsEnum.Playing)
  const { t } = useTranslation()

  return (
    <Tabs
      value={tab}
      onValueChange={(value) => setTab(value as TabValue)}
      className="w-full h-full min-h-full"
    >
      <TabsList className="w-full bg-foreground/20 mb-4">
        <TabsTrigger value={TabsEnum.Playing} className={triggerStyles}>
          {t('fullscreen.playing')}
        </TabsTrigger>
        <TabsTrigger value={TabsEnum.Lyrics} className={triggerStyles}>
          {t('fullscreen.lyrics')}
        </TabsTrigger>
        <TabsTrigger value={TabsEnum.Queue} className={triggerStyles}>
          {t('fullscreen.queue')}
        </TabsTrigger>
      </TabsList>
      <div className="relative w-full h-full">
        <TabsContent
          value={TabsEnum.Playing}
          className={tabStyles}
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
          className={tabStyles}
          style={{
            backfaceVisibility: 'hidden',
            transform: getTransform(tab, TabsEnum.Lyrics),
          }}
          forceMount={true}
        >
          <MemoLyricsTab />
        </TabsContent>
        <TabsContent
          value={TabsEnum.Queue}
          className={tabStyles}
          style={{
            backfaceVisibility: 'hidden',
            transform: getTransform(tab, TabsEnum.Queue),
          }}
          forceMount={true}
        >
          <MemoSongQueue />
        </TabsContent>
      </div>
    </Tabs>
  )
}
