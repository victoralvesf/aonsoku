import { FastAverageColorResult } from 'fast-average-color'
import { Fragment, useRef, useState } from 'react'
import { Link } from 'react-router-dom'

import { getCoverArtUrl } from '@/api/httpClient'
import { AlbumHeaderFallback } from '@/app/components/fallbacks/album-fallbacks'
import { Badge } from '@/app/components/ui/badge'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/routes/routesList'
import { getAverageColor } from '@/utils/getAverageColor'
import { getTextSizeClass } from '@/utils/getTextSizeClass'

interface ImageHeaderProps {
  type: string
  title: string
  subtitle?: string
  artistId?: string
  coverArtId: string
  coverArtSize: string
  coverArtAlt: string
  badges: (string | number | null)[]
}

export default function ImageHeader({
  type,
  title,
  subtitle,
  artistId,
  coverArtId,
  coverArtSize,
  coverArtAlt,
  badges,
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

  const imageUrl = getCoverArtUrl(coverArtId, coverArtSize)

  return (
    <>
      {!loaded && <AlbumHeaderFallback />}
      <div
        className={cn(
          'w-full px-8 py-6 flex gap-4 bg-gradient-to-b from-white/50 to-white/50 dark:from-black/50 dark:to-black/50',
          !loaded ? 'hidden' : 'visible',
        )}
        style={{ backgroundColor: bgColor?.hex }}
      >
        <div
          className="w-[200px] h-[200px] min-w-[200px] min-h-[200px] 2xl:w-[250px] 2xl:h-[250px] 2xl:min-w-[250px] 2xl:min-h-[250px] aspect-square bg-cover bg-center rounded shadow-lg"
          style={{ backgroundImage: `url(${imageUrl})` }}
        >
          <img
            crossOrigin="anonymous"
            ref={imageRef}
            src={imageUrl}
            alt={coverArtAlt}
            className="hidden"
            width={250}
            height={250}
            onLoad={handleLoadImage}
          />
        </div>

        <div className="flex flex-col justify-end">
          <p className="text-xs 2xl:text-sm mb-1 2xl:mb-2 font-medium">
            {type}
          </p>
          <h1
            className={cn(
              'scroll-m-20 font-bold tracking-tight mb-1 2xl:mb-2 antialiased',
              getTextSizeClass(title),
            )}
          >
            {title}
          </h1>
          {subtitle && artistId && (
            <Link to={ROUTES.ARTIST.PAGE(artistId)}>
              <h4 className="scroll-m-20 text-base 2xl:text-lg font-medium tracking-tight opacity-70 hover:underline">
                {subtitle}
              </h4>
            </Link>
          )}

          <div className="flex gap-2 mt-1 2xl:mt-2">
            {badges.map((badge, index) => (
              <Fragment key={index}>
                {badge && <Badge variant="secondary">{badge}</Badge>}
              </Fragment>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
