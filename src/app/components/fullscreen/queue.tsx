import {
  Table,
  TableBody,
  TableCell,
  TableRow,
} from '@/app/components/ui/table'
import { usePlayer } from '@/app/contexts/player-context'
import { cn } from '@/lib/utils'
import { convertSecondsToTime } from '@/utils/convertSecondsToTime'

export function FullscreenSongQueue() {
  const { currentSongList, setSongList, getCurrentSong } = usePlayer()

  if (currentSongList.length === 0)
    return (
      <div className="flex justify-center items-center">
        <span>No songs in queue</span>
      </div>
    )

  const currentSongId = getCurrentSong().id

  return (
    <Table className="h-full mb-1 bg-transparent">
      <TableBody className="rounded-md">
        {currentSongList.map((entry, index) => (
          <TableRow
            key={entry.id}
            className={cn(
              'hover:bg-muted-foreground/15 border-0 cursor-pointer',
              currentSongId === entry.id && 'bg-primary/25',
            )}
            onClick={() => {
              if (currentSongId !== entry.id) {
                setSongList(currentSongList, index)
              }
            }}
          >
            <TableCell className="w-[30px] text-center font-medium">
              {index + 1}
            </TableCell>
            <TableCell>
              <span className="font-semibold">{entry.title}</span>
              <p className="font-light text-sm text-foreground/70">
                {entry.artist}
              </p>
            </TableCell>
            <TableCell>{convertSecondsToTime(entry.duration)}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
