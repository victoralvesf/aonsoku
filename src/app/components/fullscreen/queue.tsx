import { useCallback, useEffect, useRef } from 'react'
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
  const { currentSongList, currentSongIndex, setSongList, getCurrentSong } =
    usePlayer()
  const songRefs = useRef<HTMLTableRowElement[]>([])

  const moveSongToTop = useCallback(() => {
    if (songRefs.current && songRefs.current[currentSongIndex]) {
      songRefs.current[currentSongIndex].scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, [currentSongIndex])

  useEffect(() => {
    if (currentSongList.length === 0) return

    moveSongToTop()
  }, [currentSongIndex, currentSongList, moveSongToTop])

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
            ref={(el) => {
              if (el) songRefs.current[index] = el
            }}
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
