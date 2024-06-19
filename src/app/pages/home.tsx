import { useLoaderData } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

import { ISong } from '@/types/responses/song'
import HomeHeader from '@/app/components/home/header'
import PreviewList from '@/app/components/home/preview-list'
import { AlbumsListData } from '@/types/responses/album'
import { ROUTES } from '@/routes/routesList'

interface HomeLoaderData {
  randomSongs: ISong[]
  newestAlbums: AlbumsListData
  frequentAlbums: AlbumsListData
  recentAlbums: AlbumsListData
  randomAlbums: AlbumsListData
}

export default function Home() {
  const {
    randomSongs,
    frequentAlbums,
    newestAlbums,
    recentAlbums,
    randomAlbums,
  } = useLoaderData() as HomeLoaderData

  const { t } = useTranslation()

  const homeSections = [
    { title: t('home.recentlyPlayed'), list: recentAlbums.list },
    { title: t('home.mostPlayed'), list: frequentAlbums.list },
    { title: t('home.recentlyAdded'), list: newestAlbums.list },
    { title: t('home.explore'), list: randomAlbums.list },
  ]

  return (
    <div className="w-full">
      <HomeHeader songs={randomSongs} />

      {homeSections.map((section) => (
        <PreviewList
          key={section.title}
          title={section.title}
          moreRoute={ROUTES.LIBRARY.ALBUMS}
          list={section.list}
        />
      ))}
    </div>
  )
}
