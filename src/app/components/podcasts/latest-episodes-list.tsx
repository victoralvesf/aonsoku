import { useVirtualizer } from '@tanstack/react-virtual'
import { memo, useRef } from 'react'
import { Episode } from '@/types/responses/podcasts'
import { getMainScrollElement } from '@/utils/scrollPageToTop'
import { EpisodeCard } from './episode-card'

const MemoEpisodeCard = memo(EpisodeCard)

interface LatestEpisodesListProps {
  episodes: Episode[]
}

export function LatestEpisodesList({ episodes }: LatestEpisodesListProps) {
  const el = getMainScrollElement()
  const scrollDivRef = useRef<HTMLDivElement | null>(el)

  const virtualizer = useVirtualizer({
    count: episodes.length,
    getScrollElement: () => scrollDivRef.current,
    estimateSize: () => 124,
    overscan: 5,
  })

  const items = virtualizer.getVirtualItems()

  return (
    <div
      style={{
        height: virtualizer.getTotalSize(),
        position: 'relative',
      }}
    >
      {items.map((virtualRow) => {
        const episode = episodes[virtualRow.index]

        return (
          <MemoEpisodeCard
            episode={episode}
            key={virtualRow.index}
            latest={true}
            style={{
              position: 'absolute',
              top: virtualRow.start,
              width: '100%',
            }}
          />
        )
      })}
    </div>
  )
}
