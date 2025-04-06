import clsx from 'clsx'
import { useEffect, useMemo, useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { getCoverArtUrl } from '@/api/httpClient'
import { usePlayerCurrentSong, useSongColor } from '@/store/player.store'
import { isChromeOrFirefox } from '@/utils/browser'
import { hexToRgba } from '@/utils/getAverageColor'
import { isSafari } from '@/utils/osType'

export function FullscreenBackdrop() {
  const { useSongColorOnBigPlayer } = useSongColor()

  if (useSongColorOnBigPlayer) {
    return <DynamicColorBackdrop />
  }

  return <ImageBackdrop />
}

export function ImageBackdrop() {
  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
      {isSafari ? <MacBackdrop /> : <OtherBackdrop />}
    </div>
  )
}

function OtherBackdrop() {
  const { coverArt } = usePlayerCurrentSong()
  const coverArtUrl = getCoverArtUrl(coverArt, 'song', '300')
  const [backgroundImage, setBackgroundImage] = useState(coverArtUrl)
  const { bigPlayerBlur } = useSongColor()

  const newBackgroundImage = useMemo(() => coverArtUrl, [coverArtUrl])

  useEffect(() => {
    const img = new Image()
    img.src = newBackgroundImage
    img.onload = () => {
      setBackgroundImage(newBackgroundImage)
    }
  }, [newBackgroundImage])

  return (
    <div className="relative w-full h-full transition-colors duration-1000 bg-black/0">
      <div
        className="absolute -inset-10 bg-cover bg-center z-0 transition-[background-image] duration-1000"
        style={{
          backgroundImage: `url(${backgroundImage})`,
          filter: `blur(${bigPlayerBlur.value}px)`,
        }}
      />
      <div className="bg-background/50 absolute inset-0 w-full h-full z-0 transition-colors duration-1000" />
    </div>
  )
}

function MacBackdrop() {
  const { coverArt, title } = usePlayerCurrentSong()
  const coverArtUrl = getCoverArtUrl(coverArt, 'song', '300')
  const { bigPlayerBlur } = useSongColor()
  const { currentSongColor, currentSongColorIntensity } = useSongColor()

  const backgroundColor = useMemo(() => {
    if (!currentSongColor) return undefined

    return hexToRgba(currentSongColor, currentSongColorIntensity)
  }, [currentSongColor, currentSongColorIntensity])

  return (
    <div
      className="relative w-full h-full flex items-center transition-colors duration-1000"
      style={{ backgroundColor }}
    >
      <LazyLoadImage
        key={coverArt}
        src={coverArtUrl}
        alt={title}
        effect="opacity"
        width="100%"
        className="w-full bg-contain"
      />
      <div
        className="absolute bg-background/50 inset-0 z-10"
        style={{
          WebkitBackdropFilter: `blur(${bigPlayerBlur.value}px)`,
          backdropFilter: `blur(${bigPlayerBlur.value}px)`,
        }}
      />
    </div>
  )
}

function DynamicColorBackdrop() {
  const { currentSongColor, currentSongColorIntensity } = useSongColor()

  const backgroundColor = useMemo(() => {
    if (!currentSongColor) return undefined

    return hexToRgba(currentSongColor, currentSongColorIntensity)
  }, [currentSongColor, currentSongColorIntensity])

  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
      <div
        className={clsx(
          'relative w-full h-full',
          isChromeOrFirefox && 'bg-black/0',
        )}
      >
        <div
          className={clsx(
            'absolute inset-0 w-full h-full z-[1]',
            'transition-[background-image] duration-1000 default-gradient',
          )}
        />
        <div
          className="absolute inset-0 w-full h-full z-0 transition-[background-color] duration-1000"
          style={{ backgroundColor }}
        />
      </div>
    </div>
  )
}
