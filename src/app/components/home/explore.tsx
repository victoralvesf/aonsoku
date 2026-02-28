import { useTranslation } from 'react-i18next'
import { PreviewListFallback } from '@/app/components/fallbacks/home-fallbacks'
import { useGetRandomAlbums } from '@/app/hooks/use-home'
import { ROUTES } from '@/routes/routesList'
import PreviewList from './preview-list'

export function Explore() {
  const { t } = useTranslation()
  const { data, isLoading } = useGetRandomAlbums()

  if (isLoading) {
    return <PreviewListFallback />
  }

  if (!data || !data.list || data.list.length === 0) return null

  return (
    <PreviewList
      title={t('home.explore')}
      moreRoute={ROUTES.ALBUMS.RANDOM}
      list={data.list}
    />
  )
}
