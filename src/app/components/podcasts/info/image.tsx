import clsx from 'clsx'
import { ComponentPropsWithoutRef, useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { CustomLightBox } from '@/app/components/lightbox'

type PodcastInfoImageProps = ComponentPropsWithoutRef<'img'>

export function PodcastInfoImage({ src, alt }: PodcastInfoImageProps) {
  const [open, setOpen] = useState(false)

  return (
    <div
      className={clsx(
        'w-[200px] h-[200px] min-w-[200px] min-h-[200px]',
        '2xl:w-[250px] 2xl:h-[250px] 2xl:min-w-[250px] 2xl:min-h-[250px]',
        'bg-skeleton aspect-square bg-cover bg-center rounded',
        'shadow-[0_0_5px_rgba(255,255,255,0.05)] border border-border overflow-hidden',
        'hover:scale-[1.02] ease-linear duration-100',
      )}
    >
      <LazyLoadImage
        src={src}
        alt={alt}
        effect="opacity"
        className="aspect-square object-cover w-full h-full cursor-pointer"
        width="100%"
        height="100%"
        onClick={() => setOpen(true)}
      />

      {src && alt && (
        <CustomLightBox
          open={open}
          close={setOpen}
          src={src}
          alt={alt}
          size={600}
        />
      )}
    </div>
  )
}
