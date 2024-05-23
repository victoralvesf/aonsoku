import { Heart, ListVideo, Play, Repeat, Shuffle, SkipBack, SkipForward, Volume2 } from "lucide-react"

import { getCoverArtUrl } from "@/api/httpClient"
import Image from "./image"
import { Slider } from "./ui/slider"
import { Button } from "./ui/button"

export function Player() {
  const fakeImage = "mf-684e5dd0ec963c3eae01a24cc1fcb6a0_65c2ec72"

  return (
    <div className="border-t h-[100px] w-full flex items-center">
      <div className="w-full h-full grid grid-cols-player gap-2 px-4">
        {/* Track Info */}
        <div className="flex items-center gap-2">
          <Image src={getCoverArtUrl(fakeImage, "100")} width={60} className="rounded" />
          <div className="flex flex-col justify-center">
            <span className="text-sm font-medium">Yeah! (feat. Lil Jon & Ludacris)</span>
            <span className="text-xs font-light text-muted-foreground">Usher</span>
          </div>
        </div>
        {/* Main Controls */}
        <div className="col-span-2 flex flex-col justify-center items-center px-4 gap-1">
          <div className="flex w-full gap-1 justify-center items-center">
            <Button variant="ghost" className="rounded-full w-10 h-10 p-3">
              <Shuffle className="w-10 h-10 text-foreground" />
            </Button>
            <Button variant="ghost" className="rounded-full w-10 h-10 p-3">
              <SkipBack className="w-10 h-10 text-foreground" />
            </Button>
            <Button className="rounded-full w-10 h-10 p-3">
              <Play className="w-10 h-10 fill-slate-50 text-slate-50" />
            </Button>
            <Button variant="ghost" className="rounded-full w-10 h-10 p-3">
              <SkipForward className="w-10 h-10 text-foreground" />
            </Button>
            <Button variant="ghost" className="rounded-full w-10 h-10 p-3">
              <Repeat className="w-10 h-10 text-foreground" />
            </Button>
          </div>

          <div className="flex w-full gap-2 justify-center items-center">
            <small className="text-xs text-muted-foreground">00:12</small>
            <Slider
              defaultValue={[0]}
              max={100}
              step={1}
              className="cursor-pointer w-[32rem]"
            />
            <small className="text-xs text-muted-foreground">03:12</small>
          </div>
        </div>
        {/* Remain Controls and Volume */}
        <div className="flex items-center w-full justify-end">
          <div className="flex items-center gap-1">
            <Button variant="ghost" className="rounded-full w-10 h-10 p-3">
              <Heart className="w-5 h-5 text-foreground" />
            </Button>

            <Button variant="ghost" className="rounded-full w-10 h-10 p-2">
              <ListVideo className="w-4 h-4 text-foreground" />
            </Button>

            <div className="flex gap-2 ml-2">
              <Volume2 className="w-4 h-4 text-foreground" />
              <Slider
                defaultValue={[100]}
                max={100}
                step={1}
                className="cursor-pointer w-[8rem]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}