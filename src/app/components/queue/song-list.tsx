import { ListXIcon } from 'lucide-react'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/app/components/ui/button'
import { DataTableList } from '@/app/components/ui/data-table-list'
import { Separator } from '@/app/components/ui/separator'
import { queueColumns } from '@/app/tables/queue-columns'
import {
  usePlayerActions,
  usePlayerCurrentList,
  usePlayerCurrentSongIndex,
} from '@/store/player.store'
import { convertSecondsToHumanRead } from '@/utils/convertSecondsToTime'

export function QueueSongList() {
  const { t } = useTranslation()
  const currentList = usePlayerCurrentList()
  const currentSongIndex = usePlayerCurrentSongIndex()
  const { clearPlayerState, setSongList } = usePlayerActions()

  const trackListCount = currentList.length
  const trackListDuration = useMemo(() => {
    let minutes = 0
    currentList.forEach((song) => (minutes += song.duration))

    return convertSecondsToHumanRead(minutes)
  }, [currentList])

  const columns = queueColumns()

  return (
    <div className="flex flex-1 flex-col h-full min-w-[300px]">
      <div className="flex items-center justify-between h-8 mb-2">
        <div className="flex gap-2 h-6 items-center text-muted-foreground">
          <p className="text-foreground">{t('queue.title')}</p>
          <p>{'•'}</p>
          <p className="text-sm">
            {t('playlist.songCount', { count: trackListCount })}
          </p>
          <p>{'•'}</p>
          <p className="text-sm">
            {t('playlist.duration', { duration: trackListDuration })}
          </p>
        </div>

        <div>
          <Button
            variant="ghost"
            className="px-4 h-8 rounded-full py-0 flex items-center justify-center"
            onClick={clearPlayerState}
          >
            <ListXIcon className="mr-1 w-5 h-5" />
            <span className="text-sm">{t('queue.clear')}</span>
          </Button>
        </div>
      </div>
      <Separator />

      <div className="w-full h-full overflow-auto">
        <DataTableList
          data={currentList}
          columns={columns}
          showHeader={false}
          handlePlaySong={(row) => setSongList(currentList, row.index)}
          scrollToIndex={true}
          currentSongIndex={currentSongIndex}
          allowRowSelection={false}
          showContextMenu={false}
        />
      </div>
    </div>
  )
}
