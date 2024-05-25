import { ISong } from "@/types/responses/song"
import { useLoaderData } from "react-router-dom"
import HomeHeader from "../components/home/header"
import RecentlyAddedPreview from "../components/home/recently-added-preview"
import { Albums } from "@/types/responses/album"

interface HomeLoaderData {
  randomSongs: ISong[]
  recentlyAdded: Albums[]
}

export default function Home() {
  const { randomSongs, recentlyAdded } = useLoaderData() as HomeLoaderData

  console.log(recentlyAdded)

  return (
    <div className="w-full">
      <HomeHeader songs={randomSongs} />

      <RecentlyAddedPreview recentlyAdded={recentlyAdded} />
    </div>
  )
}