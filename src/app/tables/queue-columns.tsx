import { Link } from 'react-router-dom'
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
            type="song"
            trackNumber={trackNumber}
            trackId={song.id}
            title={song.title}
            artist={song.artist}
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
        width: '25%',
        maxWidth: '25%',
      },
      header: '',
      cell: ({ row }) => {
        if (!row.original.artistId) return row.original.artist
        const { setQueueDrawerState } = usePlayerStore.getState().actions

        return (
          <Link
            to={ROUTES.ARTIST.PAGE(row.original.artistId)}
            className="hover:underline truncate"
            onClick={() => setQueueDrawerState(false)}
            onContextMenu={(e) => {
              e.stopPropagation()
              e.preventDefault()
            }}
          >
            {row.original.artist}
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
