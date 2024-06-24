import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/app/components/ui/tabs'
import { FullscreenSongQueue } from './queue'
import { useTranslation } from 'react-i18next'

export function FullscreenTabs({ lyrics }: { lyrics: string }) {
  const { t } = useTranslation()

  return (
    <Tabs defaultValue="queue" className="w-full h-full">
      <TabsList className="w-full bg-muted/50 mb-4">
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
      <TabsContent
        value="queue"
        className="mt-0 h-[calc(100%-60px)] overflow-y-auto pr-1"
      >
        <FullscreenSongQueue />
      </TabsContent>
      <TabsContent
        value="lyrics"
        className="mt-0 h-[calc(100%-60px)] overflow-y-auto"
      >
        {lyrics && (
          <div className="text-center font-medium text-base 2xl:text-xl px-2">
            <TextWithBreaks text={lyrics} />
          </div>
        )}
      </TabsContent>
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
