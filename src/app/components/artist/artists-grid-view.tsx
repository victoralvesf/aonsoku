import { useGrid, useVirtualizer } from '@virtual-grid/react'
import { Fragment, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getCoverArtUrl } from '@/api/httpClient'
import { PreviewCard } from '@/app/components/preview-card/card'
import { useSongList } from '@/app/hooks/use-song-list'
import { ROUTES } from '@/routes/routesList'
import { usePlayerActions } from '@/store/player.store'
import { ISimilarArtist } from '@/types/responses/artist'
import { getMainScrollElement } from '@/utils/scrollPageToTop'

type ArtistsGridViewProps = {
  artists: ISimilarArtist[]
}

const gapSizeInPixels = 16
const paddingSizeInPixels = 32

export function ArtistsGridView({ artists }: ArtistsGridViewProps) {
  const { t } = useTranslation()
  const { getArtistAllSongs } = useSongList()
  const { setSongList } = usePlayerActions()

  const scrollDivRef = useRef<HTMLDivElement | null>(null)
  const [gridColumnsSize, setGridColumnsSize] = useState(6)

  useEffect(() => {
    scrollDivRef.current = getMainScrollElement()
  }, [])

  const columnSize = () => {
    if (!scrollDivRef.current) return 181

    const pageWidth = scrollDivRef.current.offsetWidth
    const gapsDifference = (gridColumnsSize - 1) * 16
    const bothSidesPaddingSize = paddingSizeInPixels * 2
    const remainSpace = pageWidth - bothSidesPaddingSize - gapsDifference

    const width = remainSpace / gridColumnsSize
    const height = width + 40

    return {
      width,
      height,
    }
  }

  useEffect(() => {
    const handleResize = () => {
      // 2xl breakpoint
      if (window.innerWidth >= 1536) {
        setGridColumnsSize(8)
      } else {
        setGridColumnsSize(6)
      }
    }

    handleResize()
    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  const size = columnSize()

  console.log(size)

  const grid = useGrid({
    scrollRef: scrollDivRef,
    count: artists.length,
    totalCount: artists.length,
    columns: gridColumnsSize,
    rows: Math.ceil(artists.length / gridColumnsSize),
    size,
    padding: {
      x: paddingSizeInPixels,
    },
    gap: gapSizeInPixels,
    overscan: 5,
  })

  const rowVirtualizer = useVirtualizer(grid.rowVirtualizer)
  const columnVirtualizer = useVirtualizer(grid.columnVirtualizer)

  useEffect(() => {
    rowVirtualizer.measure()
  }, [rowVirtualizer, grid.virtualItemHeight])

  useEffect(() => {
    columnVirtualizer.measure()
  }, [columnVirtualizer, grid.virtualItemWidth])

  async function handlePlayArtistRadio(artist: ISimilarArtist) {
    const songList = await getArtistAllSongs(artist.name)
    if (songList) setSongList(songList, 0)
  }

  return (
    <div
      style={{
        width: columnVirtualizer.getTotalSize(),
        height: rowVirtualizer.getTotalSize(),
        position: 'relative',
      }}
    >
      {rowVirtualizer.getVirtualItems().map((virtualRow) => (
        <Fragment key={virtualRow.key}>
          {columnVirtualizer.getVirtualItems().map((virtualColumn) => {
            const item = grid.getVirtualItem({
              row: virtualRow,
              column: virtualColumn,
            })

            if (!item) return null

            const artist = artists[item.index]

            return (
              <PreviewCard.Root
                key={virtualColumn.key}
                className="flex flex-col"
                style={item.style}
              >
                <PreviewCard.ImageWrapper link={ROUTES.ARTIST.PAGE(artist.id)}>
                  <PreviewCard.Image
                    src={getCoverArtUrl(artist.coverArt, 'artist')}
                    alt={artist.name}
                  />
                  <PreviewCard.PlayButton
                    onClick={() => handlePlayArtistRadio(artist)}
                  />
                </PreviewCard.ImageWrapper>
                <PreviewCard.InfoWrapper>
                  <PreviewCard.Title link={ROUTES.ARTIST.PAGE(artist.id)}>
                    {artist.name}
                  </PreviewCard.Title>
                  <PreviewCard.Subtitle enableLink={false}>
                    {t('artist.info.albumsCount', {
                      count: artist.albumCount,
                    })}
                  </PreviewCard.Subtitle>
                </PreviewCard.InfoWrapper>
              </PreviewCard.Root>
            )
          })}
        </Fragment>
      ))}
    </div>
  )
}
