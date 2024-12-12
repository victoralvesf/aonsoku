import clsx from 'clsx'
import { getCoverArtUrl } from '@/api/httpClient'
import { usePlayerCurrentSong } from '@/store/player.store'
import { isChromeOrFirefox } from '@/utils/browser'

export default function FullscreenBackdrop() {
  const currentSong = usePlayerCurrentSong()
  const coverArtUrl = getCoverArtUrl(currentSong.coverArt, 'song', '600')
  const backgroundImage = `url(${coverArtUrl})`

  return (
    <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
      <div
        className={clsx(
          'relative w-full h-full',
          isChromeOrFirefox && 'bg-black/60',
        )}
      >
        <div
          className="absolute -inset-10 bg-cover bg-center z-0"
          style={{
            backgroundImage,
            filter: isChromeOrFirefox ? 'blur(40px)' : undefined,
          }}
        />
        <div
          className={clsx(
            'absolute inset-0 w-full h-full z-0',
            !isChromeOrFirefox && 'backdrop-blur-2xl',
            'bg-background/50',
          )}
        />
      </div>
    </div>
  )
}
