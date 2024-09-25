import { useTranslation } from 'react-i18next'
import {
  HeaderFallback,
  PreviewListFallback,
} from '@/app/components/fallbacks/home-fallbacks'
import HomeHeader from '@/app/components/home/carousel/header'
import PreviewList from '@/app/components/home/preview-list'
import {
  useGetMostPlayed,
  useGetRandomAlbums,
  useGetRandomSongs,
  useGetRecentlyAdded,
  useGetRecentlyPlayed,
} from '@/app/hooks/use-home'
import { ROUTES } from '@/routes/routesList'

export default function Home() {
  const { t } = useTranslation()

  const { data: randomSongs, isLoading, isFetching } = useGetRandomSongs()

  const recentlyPlayed = useGetRecentlyPlayed()
  const mostPlayed = useGetMostPlayed()
  const recentlyAdded = useGetRecentlyAdded()
  const randomAlbums = useGetRandomAlbums()

  const sections = [
    {
      title: t('home.recentlyPlayed'),
      data: recentlyPlayed.data,
      loader: recentlyPlayed.isLoading,
      route: ROUTES.ALBUMS.RECENTLY_PLAYED,
    },
    {
      title: t('home.mostPlayed'),
      data: mostPlayed.data,
      loader: mostPlayed.isLoading,
      route: ROUTES.ALBUMS.MOST_PLAYED,
    },
    {
      title: t('home.recentlyAdded'),
      data: recentlyAdded.data,
      loader: recentlyAdded.isLoading,
      route: ROUTES.ALBUMS.RECENTLY_ADDED,
    },
    {
      title: t('home.explore'),
      data: randomAlbums.data,
      loader: randomAlbums.isLoading,
      route: ROUTES.ALBUMS.RANDOM,
    },
  ]

  return (
    <div className="w-full px-8 py-6">
      {isFetching || isLoading ? (
        <HeaderFallback />
      ) : (
        <HomeHeader songs={randomSongs || []} />
      )}

      {sections.map((section) => {
        if (section.loader) {
          return <PreviewListFallback key={section.title} />
        }

        if (!section.data || !section.data?.list) return null

        return (
          <PreviewList
            key={section.title}
            title={section.title}
            moreRoute={section.route}
            list={section.data.list}
          />
        )
      })}
    </div>
  )
}
