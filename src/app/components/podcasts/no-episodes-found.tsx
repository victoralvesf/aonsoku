import { PodcastIcon, SlashIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

export function NoEpisodesFound() {
  const { t } = useTranslation()

  return (
    <div className="w-full px-8 mt-4">
      <div className="w-full h-64 flex flex-col items-center justify-center gap-2 text-muted-foreground border border-dashed rounded-md">
        <div className="relative flex items-center justify-center">
          <SlashIcon className="w-6 h-6 rotate-90 absolute" />
          <PodcastIcon className="w-6 h-6" />
        </div>
        <p>{t('podcasts.list.notFoundMessage')}</p>
      </div>
    </div>
  )
}
