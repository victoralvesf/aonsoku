import { Suspense, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Await, useLoaderData } from 'react-router-dom'
import { getCoverArtUrl } from '@/api/httpClient'
import PlayButtons from '@/app/components/album/play-buttons'
import { PlaylistFallback } from '@/app/components/fallbacks/playlist-fallbacks'
import Image from '@/app/components/image'
import { PlaylistOptions } from '@/app/components/playlist/options'
import { RemovePlaylistDialog } from '@/app/components/playlist/remove-dialog'
import { Badge } from '@/app/components/ui/badge'
import { DataTable } from '@/app/components/ui/data-table'
import ErrorPage from '@/app/pages/error-page'
import { songsColumns } from '@/app/tables/songs-columns'
import { cn } from '@/lib/utils'
import { usePlayerActions } from '@/store/player.store'
import { ColumnFilter } from '@/types/columnFilter'
import { PlaylistWithEntries } from '@/types/responses/playlist'
import { convertSecondsToHumanRead } from '@/utils/convertSecondsToTime'
import { getTextSizeClass } from '@/utils/getTextSizeClass'

interface PlaylistLoaderResponse {
  playlistPromise: Promise<PlaylistWithEntries>
}

export default function Playlist() {
  const { playlistPromise } = useLoaderData() as PlaylistLoaderResponse

  return (
    <Suspense fallback={<PlaylistFallback />}>
      <Await resolve={playlistPromise} errorElement={<ErrorPage />}>
        {(playlist: PlaylistWithEntries) => (
          <ResolvedPlaylist playlist={playlist} />
        )}
      </Await>
    </Suspense>
  )
}

function ResolvedPlaylist({ playlist }: { playlist: PlaylistWithEntries }) {
  const { t } = useTranslation()
  const columns = songsColumns()
  const [removeDialogState, setRemoveDialogState] = useState(false)
  const { setSongList } = usePlayerActions()

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

  return (
    <div className="w-full px-4 py-6 lg:px-8">
      <div className="flex">
        <Image
          src={getCoverArtUrl(playlist.coverArt)}
          alt={playlist.name}
          className="rounded-lg shadow-md resize-none bg-background aspect-square min-w-[200px] w-[200px] 2xl:w-[250px] 2xl:min-w-[250px]"
        />
        <div className="ml-4 w-full flex flex-col justify-end">
          <p className="text-xs 2xl:text-sm mb-2">{t('playlist.headline')}</p>
          <h2
            className={cn(
              'scroll-m-20 font-bold tracking-tight antialiased',
              getTextSizeClass(playlist.name),
            )}
          >
            {playlist.name}
          </h2>
          <p className="text-xs 2xl:text-sm text-muted-foreground mt-2">
            {playlist.comment}
          </p>
          <div className="flex gap-1 mt-3 text-muted-foreground text-sm">
            <Badge variant="default" className="shadow">
              {t('playlist.songCount', {
                count: playlist.songCount,
              })}
            </Badge>
            {playlist.duration > 0 && (
              <Badge variant="default" className="shadow">
                {t('playlist.duration', {
                  duration: convertSecondsToHumanRead(playlist.duration),
                })}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <PlayButtons
        playButtonTooltip={t('playlist.buttons.play', {
          name: playlist.name,
        })}
        handlePlayButton={() => setSongList(playlist.entry, 0)}
        disablePlayButton={!playlist.entry}
        shuffleButtonTooltip={t('playlist.buttons.shuffle', {
          name: playlist.name,
        })}
        handleShuffleButton={() => setSongList(playlist.entry, 0, true)}
        disableShuffleButton={!playlist.entry}
        optionsTooltip={t('playlist.buttons.options', {
          name: playlist.name,
        })}
        showLikeButton={false}
        optionsMenuItems={
          <PlaylistOptions
            playlist={playlist}
            onRemovePlaylist={() => setRemoveDialogState(true)}
            disablePlayNext={!playlist.entry}
            disableAddLast={!playlist.entry}
            disableDownload={!playlist.entry}
          />
        }
      />

      <RemovePlaylistDialog
        playlistId={playlist.id}
        openDialog={removeDialogState}
        setOpenDialog={setRemoveDialogState}
      />

      <DataTable
        columns={columns}
        data={playlist.entry ?? []}
        handlePlaySong={(row) => setSongList(playlist.entry, row.index)}
        columnFilter={columnsToShow}
        noRowsMessage={t('playlist.noSongList')}
      />
    </div>
  )
}
