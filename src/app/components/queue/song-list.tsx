import { ListXIcon } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/app/components/ui/button'
import { DataTableList } from '@/app/components/ui/data-table-list'
import { DialogTitle } from '@/app/components/ui/dialog'
import { Separator } from '@/app/components/ui/separator'
import { queueColumns } from '@/app/tables/queue-columns'
import {
  usePlayerActions,
  usePlayerContext,
  usePlayerCurrentList,
  usePlayerCurrentSongIndex,
} from '@/store/player.store'
import { ColumnFilter } from '@/types/columnFilter'
import { PlaybackSource } from '@/types/playerContext'
import { convertSecondsToHumanRead } from '@/utils/convertSecondsToTime'

export function QueueSongList() {
  const { t } = useTranslation()
  const currentList = usePlayerCurrentList()
  const currentSongIndex = usePlayerCurrentSongIndex()
  const { clearPlayerState, setSongList } = usePlayerActions()
  const { source } = usePlayerContext()

  const columns = useMemo(() => queueColumns(), [])
  const trackListCount = useMemo(() => currentList.length, [currentList])

  const trackListDuration = useMemo(() => {
    let minutes = 0
    currentList.forEach((song) => (minutes += song.duration))

    return convertSecondsToHumanRead(minutes)
  }, [currentList])

  const columnsToShow: ColumnFilter[] = [
    'index',
    'title',
    'album',
    'duration',
    'remove',
  ]

  function getSourceLabel(source: PlaybackSource | null) {
    if (!source) return null

    return source.name
  }

  const sourceLabel = getSourceLabel(source)

  return (
    <div className="flex flex-1 flex-col h-full min-w-[300px]">
      <DialogTitle className="sr-only">{t('queue.title')}</DialogTitle>
      <div className="flex items-center justify-between h-8 mb-2">
        <div className="flex gap-2 items-center text-foreground/70 text-sm whitespace-nowrap shrink min-w-0">
          <span className="text-foreground shrink-0">{t('queue.title')}</span>
          {sourceLabel && (
            <div className="hidden md:flex gap-2 items-center shrink min-w-0">
              <span className="shrink-0">{'•'}</span>
              <span className="truncate">{sourceLabel}</span>
            </div>
          )}
          <span className="shrink-0">{'•'}</span>
          <span className="shrink-0">
            {t('playlist.songCount', { count: trackListCount })}
          </span>
          <span className="shrink-0">{'•'}</span>
          <span className="shrink-0">
            {t('playlist.duration', { duration: trackListDuration })}
          </span>
        </div>

        <div>
          <Button
            variant="ghost"
            className="px-4 h-8 rounded-full py-0 flex items-center justify-center hover:bg-foreground/20"
            onClick={clearPlayerState}
          >
            <ListXIcon className="mr-1 w-5 h-5" />
            <span className="text-sm">{t('queue.clear')}</span>
          </Button>
        </div>
      </div>
      <Separator className="bg-muted-foreground/20" />

      <div className="w-full h-full overflow-auto">
        <DataTableList
          data={currentList}
          columns={columns}
          columnFilter={columnsToShow}
          showHeader={false}
          handlePlaySong={(row) =>
            setSongList(currentList, row.index, undefined, source)
          }
          scrollToIndex={true}
          currentSongIndex={currentSongIndex}
          allowRowSelection={false}
          showContextMenu={false}
          pageType="queue"
        />
      </div>
    </div>
  )
}
