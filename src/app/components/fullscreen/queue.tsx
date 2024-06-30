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
  const songRef = useRef<HTMLTableSectionElement>(null)

  const moveSongToTop = useCallback(() => {
    if (songRef.current) {
      const activeSong = songRef.current.querySelector('[data-state=active]')

      activeSong?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      })
    }
  }, [])

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
    <Table className="min-h-full h-full bg-transparent">
      <TableBody className="rounded-md" ref={songRef}>
        {currentSongList.map((entry, index) => (
          <TableRow
            key={entry.id}
            data-state={currentSongId === entry.id ? 'active' : 'inactive'}
            className={cn(
              'hover:shadow-md hover:bg-background/30 dark:hover:bg-muted-foreground/30 border-0 cursor-pointer rounded-lg',
              currentSongId === entry.id &&
                'bg-primary/80 hover:bg-primary dark:hover:bg-primary/70',
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
              <p className="font-normal text-sm text-foreground/70">
                {entry.artist}
              </p>
            </TableCell>
            <TableCell className="w-[100px] text-center">
              {convertSecondsToTime(entry.duration)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
