import clsx from 'clsx'
import { useEffect, useMemo, useState } from 'react'
import { getCoverArtUrl } from '@/api/httpClient'
import { usePlayerStore, useSongColor } from '@/store/player.store'
import { isChromeOrFirefox } from '@/utils/browser'

export function FullscreenBackdrop() {
  const { coverArt } = usePlayerStore((state) => state.songlist.currentSong)
  const imageUrl = getCoverArtUrl(coverArt, 'song', '300')
  const [backgroundImage, setBackgroundImage] = useState(imageUrl)

  const newBackgroundImage = useMemo(() => imageUrl, [imageUrl])

  useEffect(() => {
    const img = new Image()
    img.src = newBackgroundImage
    img.onload = () => {
      setBackgroundImage(newBackgroundImage)
    }
  }, [newBackgroundImage])

  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
      <div
        className={clsx(
          'relative w-full h-full transition-colors duration-1000',
          isChromeOrFirefox && 'bg-black/0',
        )}
      >
        <div
          className="absolute -inset-10 bg-cover bg-center z-0 transition-[background-image] duration-1000"
          style={{
            backgroundImage: `url(${backgroundImage})`,
            filter: isChromeOrFirefox ? 'blur(40px)' : undefined,
          }}
        />
        <div
          className={clsx(
            'absolute inset-0 w-full h-full z-0 transition-colors duration-1000',
            !isChromeOrFirefox && 'backdrop-blur-2xl',
            'bg-background/50',
          )}
        />
      </div>
    </div>
  )
}

export function DynamicColorBackdrop() {
  const { currentSongColor } = useSongColor()

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
          style={{ backgroundColor: currentSongColor ?? 'transparent' }}
        />
      </div>
    </div>
  )
}
