import clsx from 'clsx'
import { getCoverArtUrl } from '@/api/httpClient'
import { usePlayerCurrentSong } from '@/store/player.store'
import { isMac } from '@/utils/osType'

export default function FullscreenBackdrop() {
  const currentSong = usePlayerCurrentSong()
  const coverArtUrl = getCoverArtUrl(currentSong.coverArt, 'song', '600')
  const backgroundImage = `url(${coverArtUrl})`

  return (
    <div className="absolute inset-0 w-full h-full z-0">
      <div className={clsx('relative w-full h-full', !isMac && 'bg-black/60')}>
        <div
          className={clsx(
            'absolute -inset-10 bg-cover bg-center z-0',
            isMac && 'w-full h-full',
          )}
          style={{
            backgroundImage,
            filter: !isMac ? 'blur(40px)' : undefined,
          }}
        />
        <div
          className={clsx(
            'absolute inset-0 w-full h-full z-0',
            isMac && 'backdrop-blur-2xl',
            'bg-background/50',
          )}
        />
      </div>
    </div>
  )
}
