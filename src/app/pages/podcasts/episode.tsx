import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { convert } from 'html-to-text'
import { LazyLoadImage } from 'react-lazy-load-image-component'
import { useParams } from 'react-router-dom'
import { AlbumFallback } from '@/app/components/fallbacks/album-fallbacks'
import ListWrapper from '@/app/components/list-wrapper'
import { podcasts } from '@/service/podcasts'

export default function Episode() {
  const { episodeId } = useParams() as { episodeId: string }

  const { data: episode, isLoading } = useQuery({
    queryKey: ['get-episode', episodeId],
    queryFn: () => podcasts.getEpisode(episodeId),
  })

  if (isLoading) return <AlbumFallback />
  if (!episode) return <AlbumFallback />

  function formatEpisodeDescription(description: string) {
    const plainText = convert(description, {
      wordwrap: false,
      preserveNewlines: true,
    })

    return { __html: plainText }
  }

  return (
    <div className="h-full">
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
            src={episode.image_url}
            alt={episode.title}
            effect="opacity"
            className="aspect-square object-cover w-full h-full cursor-pointer"
            width="100%"
            height="100%"
          />
        </div>

        <div className="flex w-full flex-col justify-end space-y-2">
          <h1 className="tracking-tight font-bold text-4xl leading-snug -mb-1 antialiased drop-shadow-md line-clamp-2">
            {episode.title}
          </h1>
          {/* <h3 className="text-lg font-medium text-muted-foreground">
            {podcast.author}
          </h3> */}
        </div>
      </div>

      <ListWrapper>
        <p
          dangerouslySetInnerHTML={formatEpisodeDescription(
            episode.description,
          )}
          className="text-base font-normal leading-relaxed max-w-full text-wrap"
        />
      </ListWrapper>
    </div>
  )
}
