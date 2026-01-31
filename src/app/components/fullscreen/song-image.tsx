import clsx from 'clsx'
import { ImageLoader } from '@/app/components/image-loader'
import { AspectRatio } from '@/app/components/ui/aspect-ratio'
import { usePlayerStore } from '@/store/player.store'

export function FullscreenSongImage() {
  const { coverArt, artist, title } = usePlayerStore(({ songlist }) => {
    return songlist.currentSong
  })

  return (
    <div className="2xl:w-[33%] h-full max-w-[450px] max-h-[450px] 2xl:max-w-[550px] 2xl:max-h-[550px] items-end flex aspect-square">
      <AspectRatio
        ratio={1 / 1}
        className="rounded-lg 2xl:rounded-2xl overflow-hidden bg-accent/60"
      >
        <ImageLoader id={coverArt} type="song" size={800}>
          {(src, isLoading) => (
            <img
              src={src}
              alt={`${artist} - ${title}`}
              className={clsx(
                'aspect-square object-cover shadow-custom-5 transition-opacity duration-300 opacity-0',
                'relative after:absolute after:block after:inset-0 after:bg-accent after:text-transparent',
                !isLoading && 'opacity-100',
              )}
              width="100%"
              height="100%"
            />
          )}
        </ImageLoader>
      </AspectRatio>
    </div>
  )
}
