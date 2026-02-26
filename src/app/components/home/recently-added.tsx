import { useTranslation } from 'react-i18next'
import { PreviewListFallback } from '@/app/components/fallbacks/home-fallbacks'
import { useGetRecentlyAdded } from '@/app/hooks/use-home'
import { ROUTES } from '@/routes/routesList'
import PreviewList from './preview-list'

export function RecentlyAdded() {
  const { t } = useTranslation()
  const { data, isLoading } = useGetRecentlyAdded()

  if (isLoading) {
    return <PreviewListFallback />
  }

  if (!data || !data.list || data.list.length === 0) return null

  return (
    <PreviewList
      title={t('home.recentlyAdded')}
      moreRoute={ROUTES.ALBUMS.RECENTLY_ADDED}
      list={data.list}
    />
  )
}
