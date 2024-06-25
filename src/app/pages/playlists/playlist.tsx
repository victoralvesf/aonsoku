import { useMemo, useState } from 'react'
import { useLoaderData } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { PlaylistWithEntries } from '@/types/responses/playlist'
import { getCoverArtUrl } from '@/api/httpClient'
import { songsColumns } from '@/app/tables/songs-columns'
import { DataTable } from '@/app/components/ui/data-table'
import Image from '@/app/components/image'
import { Badge } from '@/app/components/ui/badge'
import { usePlayer } from '@/app/contexts/player-context'
import { convertSecondsToHumanRead } from '@/utils/convertSecondsToTime'
import PlayButtons from '@/app/components/album/play-buttons'
import { cn } from '@/lib/utils'
import { getTextSizeClass } from '@/utils/getTextSizeClass'
import { ColumnFilter } from '@/types/columnFilter'
import { PlaylistOptions } from '@/app/components/playlist/options'
import { RemovePlaylistDialog } from '@/app/components/playlist/remove-dialog'
import { useLang } from '@/app/contexts/lang-context'

export default function Playlist() {
  const { t } = useTranslation()
  const { langCode } = useLang()

  const playlist = useLoaderData() as PlaylistWithEntries
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const memoizedSongsColumns = useMemo(() => songsColumns(), [langCode])
  const memoizedPlaylist = useMemo(() => playlist, [playlist])

  const [removeDialogState, setRemoveDialogState] = useState(false)

  const playlistDuration =
    memoizedPlaylist.duration > 0
      ? convertSecondsToHumanRead(memoizedPlaylist.duration)
      : undefined
  const player = usePlayer()

  const columnsToShow: ColumnFilter[] = [
    'index',
    'title',
    'artist',
    'album',
    'duration',
    'playCount',
    'contentType',
    'starred',
  ]

  const buttonsTooltips = {
    play: t('playlist.buttons.play', { name: memoizedPlaylist.name }),
    shuffle: t('playlist.buttons.shuffle', { name: memoizedPlaylist.name }),
    options: t('playlist.buttons.options', { name: memoizedPlaylist.name }),
  }

  return (
    <main className="w-full">
      <div className="flex">
        <Image
          src={getCoverArtUrl(memoizedPlaylist.coverArt)}
          alt={memoizedPlaylist.name}
          width={250}
          height={250}
          className="rounded-lg shadow-md resize-none bg-background"
        />
        <div className="ml-4 w-full flex flex-col justify-end">
          <p className="text-sm mb-2">{t('playlist.headline')}</p>
          <h2
            className={cn(
              'scroll-m-20 font-bold tracking-tight antialiased',
              getTextSizeClass(memoizedPlaylist.name),
            )}
          >
            {memoizedPlaylist.name}
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            {memoizedPlaylist.comment}
          </p>
          <div className="flex gap-1 mt-2 text-muted-foreground text-sm">
            <Badge variant="default" className="shadow">
              {t('playlist.songCount', { count: memoizedPlaylist.songCount })}
            </Badge>
            {playlistDuration && (
              <Badge variant="default" className="shadow">
                {t('playlist.duration', { duration: playlistDuration })}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <PlayButtons
        playButtonTooltip={buttonsTooltips.play}
        handlePlayButton={() => player.setSongList(memoizedPlaylist.entry, 0)}
        disablePlayButton={!memoizedPlaylist.entry}
        shuffleButtonTooltip={buttonsTooltips.shuffle}
        handleShuffleButton={() =>
          player.setSongList(memoizedPlaylist.entry, 0, true)
        }
        disableShuffleButton={!memoizedPlaylist.entry}
        optionsTooltip={buttonsTooltips.options}
        showLikeButton={false}
        optionsMenuItems={
          <PlaylistOptions
            playlist={memoizedPlaylist}
            onRemovePlaylist={() => setRemoveDialogState(true)}
            disablePlayNext={!memoizedPlaylist.entry}
            disableAddLast={!memoizedPlaylist.entry}
            disableDownload={!memoizedPlaylist.entry}
          />
        }
      />

      <RemovePlaylistDialog
        playlistId={memoizedPlaylist.id}
        openDialog={removeDialogState}
        setOpenDialog={setRemoveDialogState}
      />

      {memoizedPlaylist.entry && memoizedPlaylist.entry.length > 0 ? (
        <DataTable
          columns={memoizedSongsColumns}
          data={memoizedPlaylist.entry}
          handlePlaySong={(row) =>
            player.setSongList(memoizedPlaylist.entry, row.index)
          }
          columnFilter={columnsToShow}
        />
      ) : (
        <div className="flex items-center pt-6">
          <p className="text-lg text-muted-foreground">
            {t('playlist.noSongList')}
          </p>
        </div>
      )}
    </main>
  )
}
