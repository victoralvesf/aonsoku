import { Suspense, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Await, useLoaderData } from 'react-router-dom'
import PlayButtons from '@/app/components/album/play-buttons'
import { PlaylistFallback } from '@/app/components/fallbacks/playlist-fallbacks'
import { PlaylistOptions } from '@/app/components/playlist/options'
import { PlaylistPageHeader } from '@/app/components/playlist/page-header'
import { RemovePlaylistDialog } from '@/app/components/playlist/remove-dialog'
import { DataTable } from '@/app/components/ui/data-table'
import ErrorPage from '@/app/pages/error-page'
import { songsColumns } from '@/app/tables/songs-columns'
import { usePlayerActions } from '@/store/player.store'
import { ColumnFilter } from '@/types/columnFilter'
import { PlaylistWithEntries } from '@/types/responses/playlist'

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
    'select',
  ]

  return (
    <div className="w-full px-8 py-6">
      <PlaylistPageHeader playlist={playlist} />

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
