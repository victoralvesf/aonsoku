import { Link } from 'react-router-dom'
import { ArtistLink, ArtistsLinks } from '@/app/components/song/artist-link'
import PlaySongButton from '@/app/components/table/play-button'
import { QueueActions } from '@/app/components/table/queue-actions'
import { TableSongTitle } from '@/app/components/table/song-title'
import { ROUTES } from '@/routes/routesList'
import { usePlayerStore } from '@/store/player.store'
import { ColumnDefType } from '@/types/react-table/columnDef'
import { ISong } from '@/types/responses/song'
import { convertSecondsToTime } from '@/utils/convertSecondsToTime'

export function queueColumns(): ColumnDefType<ISong>[] {
  return [
    {
      id: 'index',
      accessorKey: 'index',
      style: {
        width: 48,
        minWidth: 48,
      },
      header: '',
      cell: ({ row, table }) => {
        const trackNumber = row.index + 1
        const song = row.original

        return (
          <PlaySongButton
            trackNumber={trackNumber}
            trackId={song.id}
            handlePlayButton={() => table.options.meta?.handlePlaySong?.(row)}
          />
        )
      },
    },
    {
      id: 'title',
      accessorKey: 'title',
      style: {
        flex: 1,
        minWidth: 150,
      },
      header: '',
      cell: ({ row }) => <TableSongTitle song={row.original} />,
    },
    {
      id: 'artist',
      accessorKey: 'artist',
      style: {
        width: '30%',
        maxWidth: '30%',
      },
      header: '',
      cell: ({ row }) => {
        const { artist, artistId, artists } = row.original
        const { closeDrawer } = usePlayerStore.getState().actions

        if (artists && artists.length > 1) {
          return <ArtistsLinks artists={artists} onClickLink={closeDrawer} />
        }

        if (!artistId) return row.original.artist

        return (
          <ArtistLink artistId={artistId} onClick={closeDrawer}>
            {artist}
          </ArtistLink>
        )
      },
    },
    {
      id: 'album',
      accessorKey: 'album',
      style: {
        width: '24%',
        minWidth: '14%',
        maxWidth: '24%',
      },
      className: 'hidden lg:flex',
      enableSorting: true,
      sortingFn: 'customSortFn',
      header: '',
      cell: ({ row }) => {
        const { closeDrawer } = usePlayerStore.getState().actions

        return (
          <Link
            to={ROUTES.ALBUM.PAGE(row.original.albumId)}
            className="hover:underline truncate text-foreground/70 hover:text-foreground"
            onContextMenu={(e) => {
              e.stopPropagation()
              e.preventDefault()
            }}
            onClick={closeDrawer}
          >
            {row.original.album}
          </Link>
        )
      },
    },
    {
      id: 'duration',
      accessorKey: 'duration',
      style: {
        width: 80,
        maxWidth: 80,
        minWidth: 80,
      },
      header: '',
      cell: ({ row }) => {
        const { duration } = row.original
        const formattedDuration = convertSecondsToTime(duration ?? 0)

        return formattedDuration
      },
    },
    {
      id: 'remove',
      style: {
        width: 60,
        maxWidth: 60,
        minWidth: 60,
      },
      cell: ({ row }) => <QueueActions row={row} />,
    },
  ]
}
