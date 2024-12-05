import { useTranslation } from 'react-i18next'
import { useSearchParams } from 'react-router-dom'
import { ShadowHeader } from '@/app/components/album/shadow-header'
import { HeaderTitle } from '@/app/components/header-title'
import { AlbumsSearchParams } from '@/utils/albumsFilter'
import { SearchParamsHandler } from '@/utils/searchParamsHandler'
import { AlbumsFilter } from './filters'

interface AlbumsHeaderProps {
  albumCount: number
}

export function AlbumsHeader({ albumCount }: AlbumsHeaderProps) {
  const { t } = useTranslation()
  const [searchParams] = useSearchParams()
  const { getSearchParam } = new SearchParamsHandler(searchParams)

  const artistName = getSearchParam<string>(AlbumsSearchParams.ArtistName, '')

  const defaultLabel = t('sidebar.albums')
  const discographyLabel = t('album.list.header.albumsByArtist', {
    artist: artistName,
  })
  const label = artistName === '' ? defaultLabel : discographyLabel

  return (
    <ShadowHeader>
      <div className="w-full flex justify-between">
        <HeaderTitle title={label} count={albumCount} />

        <AlbumsFilter />
      </div>
    </ShadowHeader>
  )
}
