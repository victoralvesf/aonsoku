import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ShadowHeader } from '@/app/components/album/shadow-header'
import { EmptyWrapper } from '@/app/components/albums/empty-wrapper'
import { HeaderTitle } from '@/app/components/header-title'
import ListWrapper from '@/app/components/list-wrapper'
import { ROUTES } from '@/routes/routesList'
import { Button } from '../ui/button'

export function EmptyLatestEpisodesPage() {
  const { t } = useTranslation()

  return (
    <div className="w-full h-content">
      <ShadowHeader>
        <HeaderTitle title={t('podcasts.form.latestEpisodes')} />
      </ShadowHeader>

      <ListWrapper className="pt-[--shadow-header-distance] h-full">
        <EmptyWrapper>
          <div className="text-center max-w-[500px]">
            <h3 className="text-2xl font-semibold tracking-tight">
              {t('podcasts.latestEpisodes.emptyPage.message')}
            </h3>
            <p className="text-sm text-muted-foreground">
              {t('podcasts.latestEpisodes.emptyPage.description')}
            </p>

            <Link to={ROUTES.LIBRARY.PODCASTS}>
              <Button size="sm" variant="default" className="mt-4">
                <span>
                  {t('podcasts.latestEpisodes.emptyPage.goToPodcasts')}
                </span>
              </Button>
            </Link>
          </div>
        </EmptyWrapper>
      </ListWrapper>
    </div>
  )
}
