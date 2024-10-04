import randomCSSHexColor from '@chriscodesthings/random-css-hex-color'
import clsx from 'clsx'
import { useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Link } from 'react-router-dom'

import { getCoverArtUrl } from '@/api/httpClient'
import { AlbumHeaderFallback } from '@/app/components/fallbacks/album-fallbacks'
import { CustomLightBox } from '@/app/components/lightbox'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/routes/routesList'
import { CoverArt } from '@/types/coverArtType'
import { getAverageColor } from '@/utils/getAverageColor'
import { getTextSizeClass } from '@/utils/getTextSizeClass'
import { ImageHeaderEffect } from './header-effect'

interface ImageHeaderProps {
  type: string
  title: string
  subtitle?: string
  artistId?: string
  coverArtId?: string
  coverArtType: CoverArt
  coverArtSize: string
  coverArtAlt: string
  badges: JSX.Element
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
  const [open, setOpen] = useState(false)
  const [bgColor, setBgColor] = useState('')

  function getImage() {
    return document.getElementById('cover-art-image') as HTMLImageElement
  }

  async function handleLoadImage() {
    const img = getImage()
    if (!img) return

    let color = randomCSSHexColor(true)

    try {
      color = (await getAverageColor(img)).hex
    } catch (_) {
      console.warn(
        'handleLoadImage: unable to get image color. Using a random color.',
      )
    }

    setBgColor(color)
    setLoaded(true)
  }

  function handleError() {
    const img = getImage()
    if (!img) return

    img.crossOrigin = null

    setLoaded(true)
  }

  return (
    <div
      className="flex relative w-full h-[calc(3rem+200px)] 2xl:h-[calc(3rem+250px)]"
      key={`header-${coverArtId}`}
    >
      {!loaded && (
        <div className="absolute inset-0 z-20">
          <AlbumHeaderFallback />
        </div>
      )}
      <div
        className={cn(
          'w-full px-8 py-6 flex gap-4 absolute inset-0',
          'bg-gradient-to-b from-white/30 to-white/50',
          'dark:from-black/10 dark:to-black/30',
        )}
        style={{ backgroundColor: bgColor }}
      >
        <div
          className={cn(
            'w-[200px] h-[200px] min-w-[200px] min-h-[200px]',
            '2xl:w-[250px] 2xl:h-[250px] 2xl:min-w-[250px] 2xl:min-h-[250px]',
            'bg-skeleton aspect-square bg-cover bg-center rounded',
            'shadow-[0_4px_50px_rgba(0,0,0,0.4)] overflow-hidden',
            'hover:scale-[1.02] ease-linear duration-100',
          )}
        >
          <LazyLoadImage
            key={coverArtId}
            effect="opacity"
            crossOrigin="anonymous"
            id="cover-art-image"
            src={getCoverArtUrl(coverArtId, coverArtType, coverArtSize)}
            alt={coverArtAlt}
            className="aspect-square object-cover w-full h-full cursor-pointer"
            width="100%"
            height="100%"
            onLoad={handleLoadImage}
            onError={handleError}
            onClick={() => setOpen(true)}
          />
        </div>

        <div className="flex flex-col justify-end z-10">
          <p className="text-xs 2xl:text-sm mb-1 2xl:mb-2 font-medium drop-shadow-md">
            {type}
          </p>
          <h1
            className={clsx(
              'scroll-m-20 font-bold tracking-tight mb-1 2xl:mb-2 antialiased drop-shadow-md',
              getTextSizeClass(title),
            )}
          >
            {title}
          </h1>
          {subtitle && artistId ? (
            <Link to={ROUTES.ARTIST.PAGE(artistId)} className="w-fit">
              <h4 className="2xl:text-lg font-medium opacity-70 hover:underline drop-shadow-md">
                {subtitle}
              </h4>
            </Link>
          ) : (
            <h4 className="2xl:text-lg font-medium opacity-70 drop-shadow-md">
              {subtitle}
            </h4>
          )}

          <div className="flex gap-2 mt-1 2xl:mt-2">{badges}</div>
        </div>
      </div>

      {!loaded ? (
        <ImageHeaderEffect className="bg-muted-foreground dark:from-black/60" />
      ) : (
        <ImageHeaderEffect style={{ backgroundColor: bgColor }} />
      )}

      <CustomLightBox
        open={open}
        close={setOpen}
        src={getCoverArtUrl(coverArtId, coverArtType, coverArtSize)}
        alt={coverArtAlt}
        size={600}
      />
    </div>
  )
}
