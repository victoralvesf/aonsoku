import randomCSSHexColor from '@chriscodesthings/random-css-hex-color'
import clsx from 'clsx'
import { Fragment, useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { Link } from 'react-router-dom'

import { getCoverArtUrl } from '@/api/httpClient'
import { AlbumHeaderFallback } from '@/app/components/fallbacks/album-fallbacks'
import { CustomLightBox } from '@/app/components/lightbox'
import { Badge } from '@/app/components/ui/badge'
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
        <div className="absolute inset-0 z-10">
          <AlbumHeaderFallback />
        </div>
      )}
      <div
        className="w-full px-8 py-6 flex gap-4 bg-gradient-to-b from-white/30 to-white/50 dark:from-black/30 dark:to-black/50 absolute inset-0"
        style={{ backgroundColor: bgColor }}
      >
        <div className="w-[200px] h-[200px] min-w-[200px] min-h-[200px] 2xl:w-[250px] 2xl:h-[250px] 2xl:min-w-[250px] 2xl:min-h-[250px] bg-skeleton aspect-square bg-cover bg-center rounded shadow-lg overflow-hidden hover:scale-[1.02] ease-linear duration-100">
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

      {!loaded ? (
        <ImageHeaderEffect className="bg-muted-foreground" />
      ) : (
        <ImageHeaderEffect style={{ backgroundColor: bgColor }} />
      )}

      <CustomLightBox
        open={open}
        close={setOpen}
        src={getCoverArtUrl(coverArtId, coverArtType, '1000')}
        alt={coverArtAlt}
        size={600}
      />
    </div>
  )
}
