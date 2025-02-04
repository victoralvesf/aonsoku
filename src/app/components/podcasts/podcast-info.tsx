import clsx from 'clsx'
import { GlobeIcon, RssIcon } from 'lucide-react'
import { useState } from 'react'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { CustomLightBox } from '@/app/components/lightbox'
import { Separator } from '@/app/components/ui/separator'
import { Podcast } from '@/types/responses/podcasts'
import { parseDescription } from '@/utils/parseTexts'

interface PodcastInfoProps {
  podcast: Podcast
}

export function PodcastInfo({ podcast }: PodcastInfoProps) {
  const [open, setOpen] = useState(false)

  return (
    <div className="w-full px-8 py-6 flex gap-4">
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
          src={podcast.image_url}
          alt={podcast.title}
          effect="opacity"
          className="aspect-square object-cover w-full h-full cursor-pointer"
          width="100%"
          height="100%"
          onClick={() => setOpen(true)}
        />
      </div>

      <div className="flex w-full flex-col justify-end space-y-2">
        <h1 className="tracking-tight font-bold text-4xl leading-snug -mb-1 antialiased drop-shadow-md line-clamp-2">
          {podcast.title}
        </h1>
        <h3 className="text-lg font-medium text-muted-foreground">
          {podcast.author}
        </h3>
        <Separator />
        <p className="text-sm text-muted-foreground line-clamp-2">
          {parseDescription(podcast.description)}
        </p>
        <div className="flex gap-1 text-muted-foreground text-sm">
          <span>{podcast.episode_count} Episodes</span>
          <span className="mx-1 opacity-80">•</span>
          <a href={podcast.feed_url} target="_blank" rel="noreferrer">
            <span className="flex gap-1 items-center hover:text-primary">
              <RssIcon className="w-4 h-4" />
              Feed
            </span>
          </a>
          {podcast.link && (
            <>
              <span className="mx-1 opacity-80">•</span>
              <a href={podcast.link} target="_blank" rel="noreferrer">
                <span className="flex gap-1 items-center hover:text-primary">
                  <GlobeIcon className="w-4 h-4" />
                  Official Website
                </span>
              </a>
            </>
          )}
        </div>
      </div>

      <CustomLightBox
        open={open}
        close={setOpen}
        src={podcast.image_url}
        alt={podcast.title}
        size={600}
      />
    </div>
  )
}
