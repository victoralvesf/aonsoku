import randomCSSHexColor from '@chriscodesthings/random-css-hex-color'
import clsx from 'clsx'
import { useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import {
  AlbumArtistInfo,
  AlbumMultipleArtistsInfo,
} from '@/app/components/album/artists'
import { ImageHeaderEffect } from '@/app/components/album/header-effect'
import { AlbumHeaderFallback } from '@/app/components/fallbacks/album-fallbacks'
import { BadgesData, HeaderInfoGenerator } from '@/app/components/header-info'
import { ImageLoader } from '@/app/components/image-loader'
import { CustomLightBox } from '@/app/components/lightbox'
import { cn } from '@/lib/utils'
import { CoverArt } from '@/types/coverArtType'
import { IFeaturedArtist } from '@/types/responses/artist'
import { getAverageColor } from '@/utils/getAverageColor'
import { getTextSizeClass } from '@/utils/getTextSizeClass'

interface ImageHeaderProps {
  type: string
  title: string
  subtitle?: string
  artistId?: string
  artists?: IFeaturedArtist[]
  coverArtId?: string
  coverArtType: CoverArt
  coverArtSize: string
  coverArtAlt: string
  badges: BadgesData
  isPlaylist?: boolean
}

export default function ImageHeader({
  type,
  title,
  subtitle,
  artistId,
  artists,
  coverArtId,
  coverArtType,
  coverArtSize,
  coverArtAlt,
  badges,
  isPlaylist = false,
}: ImageHeaderProps) {
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
  }

  function handleError() {
    const img = getImage()
    if (!img) return

    img.crossOrigin = null
  }

  const hasMultipleArtists = artists ? artists.length > 1 : false

  return (
    <ImageLoader id={coverArtId} type={coverArtType} size={coverArtSize}>
      {(src, isLoading) => (
        <div
          className="flex relative w-full h-[calc(3rem+200px)] 2xl:h-[calc(3rem+250px)]"
          key={`header-${coverArtId}`}
        >
          {isLoading && (
            <div className="absolute inset-0 z-20">
              <AlbumHeaderFallback />
            </div>
          )}
          <div
            className={cn(
              'w-full px-8 py-6 flex gap-4 absolute inset-0',
              'bg-gradient-to-b from-background/20 to-background/50',
            )}
            style={{ backgroundColor: bgColor }}
          >
            <div
              className={cn(
                'w-[200px] h-[200px] min-w-[200px] min-h-[200px]',
                '2xl:w-[250px] 2xl:h-[250px] 2xl:min-w-[250px] 2xl:min-h-[250px]',
                'bg-skeleton aspect-square bg-cover bg-center rounded',
                'shadow-header-image overflow-hidden',
                'hover:scale-[1.02] ease-linear duration-100',
              )}
            >
              <LazyLoadImage
                key={coverArtId}
                effect="opacity"
                crossOrigin="anonymous"
                id="cover-art-image"
                src={src}
                alt={coverArtAlt}
                className="aspect-square object-cover w-full h-full cursor-pointer"
                width="100%"
                height="100%"
                onLoad={handleLoadImage}
                onError={handleError}
                onClick={() => setOpen(true)}
              />
            </div>

            <div className="flex w-full max-w-[calc(100%-216px)] 2xl:max-w-[calc(100%-266px)] flex-col justify-end z-10">
              <p className="text-xs 2xl:text-sm font-medium text-shadow-md">
                {type}
              </p>
              <h1
                className={clsx(
                  'max-w-full scroll-m-20 font-bold tracking-tight antialiased text-shadow-md break-words line-clamp-2',
                  getTextSizeClass(title),
                )}
              >
                {title}
              </h1>

              {!isPlaylist && artists && hasMultipleArtists && (
                <div className="flex items-center mt-2">
                  <AlbumMultipleArtistsInfo artists={artists} />
                  <HeaderInfoGenerator badges={badges} />
                </div>
              )}

              {!isPlaylist && subtitle && !hasMultipleArtists && (
                <>
                  {artistId ? (
                    <div className="flex items-center mt-2">
                      <AlbumArtistInfo id={artistId} name={subtitle} />
                      <HeaderInfoGenerator badges={badges} />
                    </div>
                  ) : (
                    <p className="opacity-80 text-sm font-medium">{subtitle}</p>
                  )}
                </>
              )}

              {isPlaylist && subtitle && (
                <>
                  <p className="text-sm opacity-80 text-shadow-md line-clamp-2 mt-1 mb-2">
                    {subtitle}
                  </p>
                  <HeaderInfoGenerator badges={badges} showFirstDot={false} />
                </>
              )}

              {!subtitle && (
                <div className="mt-1">
                  <HeaderInfoGenerator badges={badges} showFirstDot={false} />
                </div>
              )}
            </div>
          </div>

          {isLoading ? (
            <ImageHeaderEffect className="bg-muted-foreground" />
          ) : (
            <ImageHeaderEffect style={{ backgroundColor: bgColor }} />
          )}

          <CustomLightBox
            open={open}
            close={setOpen}
            src={src ?? ''}
            alt={coverArtAlt}
          />
        </div>
      )}
    </ImageLoader>
  )
}
