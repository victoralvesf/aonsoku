import { useTranslation } from 'react-i18next'
import { PreviewListFallback } from '@/app/components/fallbacks/home-fallbacks'
import { useGetRecentlyPlayed } from '@/app/hooks/use-home'
import { ROUTES } from '@/routes/routesList'
import PreviewList from './preview-list'

export function RecentlyPlayed() {
  const { t } = useTranslation()
  const { data, isLoading } = useGetRecentlyPlayed()

  if (isLoading) {
    return <PreviewListFallback />
  }

  if (!data || !data.list || data.list.length === 0) return null

  return (
    <PreviewList
      title={t('home.recentlyPlayed')}
      moreRoute={ROUTES.ALBUMS.RECENTLY_PLAYED}
      list={data.list}
    />
  )
}
