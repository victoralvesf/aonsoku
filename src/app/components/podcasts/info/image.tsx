import clsx from 'clsx'
import { ComponentPropsWithoutRef, useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { CustomLightBox } from '@/app/components/lightbox'

type PodcastInfoImageProps = ComponentPropsWithoutRef<'img'>

const placeholderSrc = '/default_podcast_art.png'

export function PodcastInfoImage({ src, alt }: PodcastInfoImageProps) {
  const [open, setOpen] = useState(false)
  const [imageSrc, setImageSrc] = useState(src)
  const isPlaceholder = imageSrc === placeholderSrc

  const handleError = () => {
    setImageSrc(placeholderSrc)
  }

  return (
    <div
      className={clsx(
        'w-[200px] h-[200px] min-w-[200px] min-h-[200px]',
        '2xl:w-[250px] 2xl:h-[250px] 2xl:min-w-[250px] 2xl:min-h-[250px]',
        'bg-skeleton aspect-square bg-cover bg-center rounded',
        'shadow-custom-5 border border-border overflow-hidden',
        'ease-linear duration-100',
        !isPlaceholder && 'cursor-pointer hover:scale-[1.02]',
      )}
    >
      <LazyLoadImage
        src={imageSrc}
        alt={alt}
        effect="opacity"
        className="aspect-square object-cover w-full h-full"
        width="100%"
        height="100%"
        onError={handleError}
        onClick={() => setOpen(true)}
      />

      {imageSrc && alt && !isPlaceholder && (
        <CustomLightBox open={open} close={setOpen} src={imageSrc} alt={alt} />
      )}
    </div>
  )
}
