import { useQuery } from '@tanstack/react-query'
import { useTranslation } from 'react-i18next'
import PreviewList from '@/app/components/home/preview-list'
import { subsonic } from '@/service/subsonic'
import { queryKeys } from '@/utils/queryKeys'

export function TopAlbums() {
  const { t } = useTranslation()

  const { data } = useQuery({
    queryKey: [queryKeys.album.mostPlayed],
    queryFn: () => subsonic.albums.getAlbumList({ size: 16, type: 'frequent' }),
  })

  const list = data?.list ?? []

  if (list.length === 0) return null

  return (
    <PreviewList title={t('activity.topAlbums')} list={list} showMore={false} />
  )
}
