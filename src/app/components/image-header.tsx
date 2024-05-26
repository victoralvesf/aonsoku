import { useRef, useState } from 'react'
import { FastAverageColorResult } from 'fast-average-color'

import { cn } from "@/lib/utils"
import { getAverageColor } from '@/utils/getAverageColor'
import { getCoverArtUrl } from '@/api/httpClient'
import { Skeleton } from './ui/skeleton'
import { Badge } from './ui/badge'
import { getTextSizeClass } from '@/utils/getTextSizeClass'

const bgGradient = "bg-gradient-to-b from-white/50 to-white/50 dark:from-black/50 dark:to-black/50"

interface ImageHeaderProps {
  type: string
  title: string
  subtitle?: string
  coverArtId: string
  coverArtSize: string
  coverArtAlt: string
  badges: (string | number | null)[]
}

export default function ImageHeader({
  type,
  title,
  subtitle,
  coverArtId,
  coverArtSize,
  coverArtAlt,
  badges
}: ImageHeaderProps) {
  const imageRef = useRef<HTMLImageElement>(null)
  const [loaded, setLoaded] = useState(false)
  const [bgColor, setBgColor] = useState<FastAverageColorResult>()

  async function handleLoadImage() {
    const img = imageRef.current
    const color = await getAverageColor(img)

    setBgColor(color)
    setLoaded(true)
  }

  return (
    <>
      {!loaded && <HeaderFallback />}
      <div
        className={cn("w-full px-4 py-6 lg:px-8 flex gap-4", bgGradient, !loaded ? "hidden" : "visible")}
        style={{ backgroundColor: bgColor?.hex }}
      >
        <div className="w-[250px] h-[250px] min-w-[250px] min-h-[250px] aspect-square overflow-clip relative rounded shadow-lg">
          <img
            crossOrigin="anonymous"
            ref={imageRef}
            src={getCoverArtUrl(coverArtId, coverArtSize)}
            alt={coverArtAlt}
            className="rounded absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
            width={250}
            height={250}
            onLoad={handleLoadImage}
          />
        </div>

        <div className="flex flex-col justify-end">
          <p className="text-sm mb-2 font-medium">
            {type}
          </p>
          <h1
            className={cn("scroll-m-20 font-extrabold tracking-tight mb-2 antialiased", getTextSizeClass(title))}
          >
            {title}
          </h1>
          {subtitle && (
            <h4 className="scroll-m-20 text-lg font-medium tracking-tight opacity-70">
              {subtitle}
            </h4>
          )}

          <div className="flex gap-2 mt-2">
            <>
              {badges.map((badge) => (
                <>
                  {badge !== null && <Badge variant="secondary">{badge}</Badge>}
                </>
              ))}
            </>
          </div>
        </div>
      </div>
    </>
  )
}

function HeaderFallback() {
  return (
    <div className={cn("w-full p-6 bg-muted-foreground flex gap-4", bgGradient)}>
      <Skeleton className="w-[250px] h-[250px] rounded shadow-lg" />
      <div className="flex flex-col justify-end">
        <Skeleton className="h-[20px] w-16 mb-2" />
        <Skeleton className="h-12 w-[260px] mb-2" />

        <div className="flex gap-2 mt-2">
          <Skeleton className="h-[22px] w-12 rounded-full" />
          <Skeleton className="h-[22px] w-12 rounded-full" />
          <Skeleton className="h-[22px] w-12 rounded-full" />
        </div>
      </div>
    </div>
  )
}
