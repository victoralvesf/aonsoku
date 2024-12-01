import clsx from 'clsx'
import { memo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs'
import { LyricsTab } from './lyrics'
import { FullscreenSongQueue } from './queue'
import { SongInfo } from './song-info'

const MemoSongQueue = memo(FullscreenSongQueue)
const MemoSongInfo = memo(SongInfo)
const MemoLyricsTab = memo(LyricsTab)

export function FullscreenTabs() {
  const [tab, setTab] = useState('playing')
  const { t } = useTranslation()

  const baseTabStyles =
    'absolute inset-0 mt-0 h-[calc(100%-64px)] overflow-y-auto transition-transform duration-300 will-change-transform'

  const baseTabTriggerStyles =
    'w-full data-[state=active]:bg-foreground data-[state=active]:text-secondary text-foreground'

  return (
    <Tabs
      value={tab}
      onValueChange={setTab}
      className="w-full h-full min-h-full"
    >
      <TabsList className="w-full bg-background/30 mb-4">
        <TabsTrigger value="queue" className={baseTabTriggerStyles}>
          {t('fullscreen.queue')}
        </TabsTrigger>
        <TabsTrigger value="playing" className={baseTabTriggerStyles}>
          {t('fullscreen.playing')}
        </TabsTrigger>
        <TabsTrigger value="lyrics" className={baseTabTriggerStyles}>
          {t('fullscreen.lyrics')}
        </TabsTrigger>
      </TabsList>
      <div className="relative w-full h-full">
        <TabsContent
          value="queue"
          className={clsx(
            baseTabStyles,
            tab === 'queue' && 'translate-x-0',
            tab === 'playing' && '-translate-x-[120%]',
            tab === 'lyrics' && '-translate-x-[240%]',
          )}
          forceMount={true}
        >
          <MemoSongQueue />
        </TabsContent>
        <TabsContent
          value="playing"
          className={clsx(
            baseTabStyles,
            'overflow-hidden',
            tab === 'playing' && 'translate-x-0',
            tab === 'queue' && 'translate-x-[120%]',
            tab === 'lyrics' && '-translate-x-[120%]',
          )}
          forceMount={true}
        >
          <MemoSongInfo />
        </TabsContent>
        <TabsContent
          value="lyrics"
          className={clsx(
            baseTabStyles,
            tab === 'lyrics' && 'translate-x-0',
            tab === 'playing' && 'translate-x-[120%]',
            tab === 'queue' && 'translate-x-[240%]',
          )}
          forceMount={true}
        >
          <MemoLyricsTab />
        </TabsContent>
      </div>
    </Tabs>
  )
}
