import clsx from 'clsx'
import { Fragment, useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Link } from 'react-router-dom'

import { getCoverArtUrl } from '@/api/httpClient'
import { AlbumHeaderFallback } from '@/app/components/fallbacks/album-fallbacks'
import { Badge } from '@/app/components/ui/badge'
import { ROUTES } from '@/routes/routesList'
import { CoverArt } from '@/types/coverArtType'
import { getAverageColor } from '@/utils/getAverageColor'
import { getTextSizeClass } from '@/utils/getTextSizeClass'

interface ImageHeaderProps {
  type: string
  title: string
  subtitle?: string
  artistId?: string
  coverArtId: string
  coverArtType: CoverArt
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
  coverArtType,
  coverArtSize,
  coverArtAlt,
  badges,
}: ImageHeaderProps) {
  const [loaded, setLoaded] = useState(false)
  const [bgColor, setBgColor] = useState('')

  async function handleLoadImage() {
    const img = document.getElementById('cover-art-image') as HTMLImageElement
    if (!img) return

    const color = await getAverageColor(img)
    setBgColor(color.hex)
    setLoaded(true)
  }

  return (
    <div
      className="flex relative w-full h-[calc(3rem+200px)] 2xl:h-[calc(3rem+250px)]"
      key={`header-${coverArtId}`}
    >
      {!loaded && (
        <div className="absolute inset-0 z-10">
          <AlbumHeaderFallback />
        </div>
      )}
      <div
        className="w-full px-8 py-6 flex gap-4 bg-gradient-to-b from-white/30 to-white/50 dark:from-black/30 dark:to-black/50 absolute inset-0"
        style={{ backgroundColor: bgColor }}
      >
        <div className="w-[200px] h-[200px] min-w-[200px] min-h-[200px] 2xl:w-[250px] 2xl:h-[250px] 2xl:min-w-[250px] 2xl:min-h-[250px] bg-skeleton aspect-square bg-cover bg-center rounded shadow-lg overflow-hidden">
          <LazyLoadImage
            key={coverArtId}
            effect="opacity"
            crossOrigin="anonymous"
            id="cover-art-image"
            src={getCoverArtUrl(coverArtId, coverArtType, coverArtSize)}
            alt={coverArtAlt}
            className="aspect-square object-cover w-full h-full"
            width="100%"
            height="100%"
            beforeLoad={() => setLoaded(false)}
            onLoad={handleLoadImage}
          />
        </div>

        <div className="flex flex-col justify-end">
          <p className="text-xs 2xl:text-sm mb-1 2xl:mb-2 font-medium">
            {type}
          </p>
          <h1
            className={clsx(
              'scroll-m-20 font-bold tracking-tight mb-1 2xl:mb-2 antialiased',
              getTextSizeClass(title),
            )}
          >
            {title}
          </h1>
          {subtitle && artistId && (
            <Link to={ROUTES.ARTIST.PAGE(artistId)} className="w-fit">
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
    </div>
  )
}
