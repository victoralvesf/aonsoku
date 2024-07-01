import { useCallback, useEffect, useRef } from 'react'
import Image from '@/app/components/image'
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
  const {
    currentSongIndex,
    currentSongList,
    getCurrentSong,
    setSongList,
    isPlaying,
  } = usePlayer()

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
    moveSongToTop()
  }, [currentSongIndex, moveSongToTop])

  if (currentSongList.length === 0)
    return (
      <div className="flex justify-center items-center">
        <span>No songs in queue</span>
      </div>
    )

  const currentSongId = getCurrentSong().id

  return (
    <Table className="min-h-full h-full bg-transparent">
      <TableBody ref={songRef}>
        {currentSongList.map((entry, index) => (
          <TableRow
            key={entry.id}
            data-state={currentSongId === entry.id ? 'active' : 'inactive'}
            className={cn(
              'hover:shadow-md hover:bg-background/30 dark:hover:bg-muted-foreground/30 border-0 cursor-pointer',
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
              {currentSongId === entry.id && isPlaying ? (
                <div className="w-6 flex items-center">
                  <div className="w-6 h-6 flex items-center justify-center">
                    <Image
                      src="/equalizer.gif"
                      className="w-5 h-5"
                      id="equalizer-image"
                      alt="Audio bars animation"
                    />
                  </div>
                </div>
              ) : (
                <div>{index + 1}</div>
              )}
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
