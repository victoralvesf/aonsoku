import { PlusIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { ShadowHeader } from '@/app/components/album/shadow-header'
import { HeaderTitle } from '@/app/components/header-title'
import { Button } from '@/app/components/ui/button'
import { PodcastsFilters } from './podcasts-filters'

export function PodcastsHeader() {
  const { t } = useTranslation()

  return (
    <ShadowHeader>
      <div className="w-full flex justify-between">
        <HeaderTitle title={t('sidebar.podcasts')} />

        <div className="flex gap-2 items-center">
          <PodcastsFilters />

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
