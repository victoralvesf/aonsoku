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

export function FullscreenTabs({ lyrics }: { lyrics: string }) {
  const { t } = useTranslation()

  return (
    <Tabs defaultValue="playing" className="w-full h-full min-h-full">
      <TabsList className="w-full bg-background/30 mb-4">
        <TabsTrigger
          value="queue"
          className="w-full data-[state=active]:bg-primary dark:data-[state=active]:bg-primary/80 hover:data-[state=inactive]:bg-background/50 text-foreground"
        >
          {t('fullscreen.queue')}
        </TabsTrigger>
        <TabsTrigger
          value="playing"
          className="w-full data-[state=active]:bg-primary dark:data-[state=active]:bg-primary/80 hover:data-[state=inactive]:bg-background/50 text-foreground"
        >
          {t('fullscreen.playing')}
        </TabsTrigger>
        <TabsTrigger
          value="lyrics"
          className="w-full data-[state=active]:bg-primary dark:data-[state=active]:bg-primary/80 hover:data-[state=inactive]:bg-background/50 text-foreground"
        >
          {t('fullscreen.lyrics')}
        </TabsTrigger>
      </TabsList>
      <TabsContent
        value="queue"
        className="mt-0 h-[calc(100%-64px)] overflow-y-auto pr-1"
      >
        <FullscreenSongQueue />
      </TabsContent>
      <TabsContent
        value="playing"
        className="mt-0 h-[calc(100%-64px)] overflow-hidden"
      >
        <SongInfo />
      </TabsContent>
      <TabsContent
        value="lyrics"
        className="mt-0 h-[calc(100%-64px)] overflow-y-auto pr-1"
      >
        {lyrics && <LyricsTab text={lyrics} />}
      </TabsContent>
    </Tabs>
  )
}
