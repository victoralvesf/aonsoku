import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs'
import { ScrollArea } from '@/app/components/ui/scroll-area'
import { FullscreenSongQueue } from './queue'
import { useTranslation } from 'react-i18next'

export function FullscreenTabs({ lyrics }: { lyrics: string }) {
  const { t } = useTranslation()

  return (
    <Tabs defaultValue="queue" className="w-full h-full">
      <TabsList className="w-full bg-muted/50">
        <TabsTrigger
          value="queue"
          className="w-full data-[state=active]:bg-background/70"
        >
          {t('fullscreen.queue')}
        </TabsTrigger>
        <TabsTrigger
          value="lyrics"
          className="w-full data-[state=active]:bg-background/70"
        >
          {t('fullscreen.lyrics')}
        </TabsTrigger>
      </TabsList>
      <ScrollArea className="mt-4 h-[calc(100%-60px)]">
        <TabsContent value="queue" className="mt-0">
          <FullscreenSongQueue />
        </TabsContent>
        <TabsContent value="lyrics" className="mt-0">
          {lyrics && (
            <div className="text-center font-medium text-base 2xl:text-xl">
              <TextWithBreaks text={lyrics} />
            </div>
          )}
        </TabsContent>
      </ScrollArea>
    </Tabs>
  )
}

const TextWithBreaks = ({ text }: { text: string }) => {
  const lines = text.split('\n')
  return (
    <div>
      {lines.map((line, index) => (
        <p key={index} className="leading-10">
          {line}
        </p>
      ))}
    </div>
  )
}
