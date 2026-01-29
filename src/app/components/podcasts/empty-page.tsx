import { Podcast } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { EmptyWrapper } from '@/app/components/albums/empty-wrapper'
import { EmptyPageContainer } from '@/app/components/empty-container'
import ListWrapper from '@/app/components/list-wrapper'
import { PodcastsHeader } from './header'

export function EmptyPodcastsPage() {
  const { t } = useTranslation()

  return (
    <EmptyPageContainer>
      <PodcastsHeader />

      <ListWrapper className="h-full">
        <EmptyWrapper>
          <div className="text-center max-w-[500px]">
            <div className="flex w-full justify-center items-center mb-2">
              <Podcast className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-semibold tracking-tight">
              {t('podcasts.emptyPage.message')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t('podcasts.emptyPage.description')}
            </p>
          </div>
        </EmptyWrapper>
      </ListWrapper>
    </EmptyPageContainer>
  )
}
