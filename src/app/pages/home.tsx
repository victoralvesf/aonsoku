import { ISong } from "@/types/responses/song"
import { useLoaderData } from "react-router-dom"
import HomeHeader from "../components/home/header"
import PreviewList from "../components/home/preview-list"
import { Albums } from "@/types/responses/album"

interface HomeLoaderData {
  randomSongs: ISong[]
  newestAlbums: Albums[]
  frequentAlbums: Albums[]
  recentAlbums: Albums[]
  randomAlbums: Albums[]
}

export default function Home() {
  const {
    randomSongs,
    frequentAlbums,
    newestAlbums,
    recentAlbums,
    randomAlbums
  } = useLoaderData() as HomeLoaderData

  const homeSections = [
    { title: 'Recently Played', route: '/library/albums/recently-played', list: recentAlbums },
    { title: 'Most Played', route: '/library/albums/most-played', list: frequentAlbums },
    { title: 'Recently Added', route: '/library/albums/recently-added', list: newestAlbums },
    { title: 'Explore', route: '/library/albums/random', list: randomAlbums }
  ]

  return (
    <div className="w-full">
      <HomeHeader songs={randomSongs} />

      {homeSections.map(section => (
        <PreviewList
          key={section.title}
          title={section.title}
          moreRoute={section.route}
          list={section.list}
        />
      ))}
    </div>
  )
}