import { HomeHeader } from '@/app/components/home/carousel/header'
import { Explore } from '@/app/components/home/explore'
import { MostPlayed } from '@/app/components/home/most-played'
import { RecentlyAdded } from '@/app/components/home/recently-added'
import { RecentlyPlayed } from '@/app/components/home/recently-played'

export default function Home() {
  return (
    <div className="w-full">
      <HomeHeader />

      <div className="px-8 pb-6">
        <RecentlyPlayed />
        <MostPlayed />
        <RecentlyAdded />
        <Explore />
      </div>
    </div>
  )
}
