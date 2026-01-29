import { useTranslation } from 'react-i18next'
import { EmptyWrapper } from '@/app/components/albums/empty-wrapper'
import { EmptyPageContainer } from '@/app/components/empty-container'
import ListWrapper from '@/app/components/list-wrapper'
import { PodcastsHeader } from './header'

export function EmptyPodcastsResults() {
  const { t } = useTranslation()

  return (
    <EmptyPageContainer>
      <PodcastsHeader />

      <ListWrapper className="h-full">
        <EmptyWrapper>
          <div className="text-center max-w-[500px]">
            <h3 className="text-2xl font-semibold tracking-tight">
              {t('podcasts.emptyResults.title')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t('podcasts.emptyResults.info')}
            </p>
            <p className="text-sm text-muted-foreground">
              {t('podcasts.emptyResults.action')}
            </p>
          </div>
        </EmptyWrapper>
      </ListWrapper>
    </EmptyPageContainer>
  )
}
