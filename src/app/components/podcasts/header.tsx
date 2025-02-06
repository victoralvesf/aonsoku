import { HistoryIcon, PlusIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { ShadowHeader } from '@/app/components/album/shadow-header'
import { HeaderTitle } from '@/app/components/header-title'
import { Button } from '@/app/components/ui/button'
import { ROUTES } from '@/routes/routesList'

export function PodcastsHeader() {
  const { t } = useTranslation()

  return (
    <ShadowHeader>
      <div className="w-full flex justify-between">
        <HeaderTitle title={t('sidebar.podcasts')} />

        <div className="flex gap-2 items-center">
          <Button variant="outline" asChild>
            <Link to={ROUTES.EPISODES.LATEST}>
              <HistoryIcon className="w-4 h-4" />
              <span className="ml-2">{t('podcasts.form.latestEpisodes')}</span>
            </Link>
          </Button>

          <Button
            size="sm"
            variant="default"
            className="px-4"
            onClick={() => {}}
          >
            <PlusIcon className="w-5 h-5 -ml-[3px]" />
            <span className="ml-2">{t('podcasts.form.addButton')}</span>
          </Button>
        </div>
      </div>
    </ShadowHeader>
  )
}
