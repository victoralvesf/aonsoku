import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import ListWrapper from '@/app/components/list-wrapper'
import { ShadowHeader } from '@/app/components/shadow-header'
import { Badge } from '@/app/components/ui/badge'
import { DataTable } from '@/app/components/ui/data-table'
import { useLang } from '@/app/contexts/lang-context'
import { usePlayer } from '@/app/contexts/player-context'
import { usePlaylists } from '@/app/contexts/playlists-context'
import { playlistsColumns } from '@/app/tables/playlists-columns'
import { subsonic } from '@/service/subsonic'

export default function PlaylistsPage() {
  const { langCode } = useLang()
  const { playlists } = usePlaylists()
  const player = usePlayer()
  const { t } = useTranslation()

  const memoizedPlaylistsColumns = useMemo(
    () => playlistsColumns(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [playlists, langCode],
  )

  async function handlePlayPlaylist(playlistId: string) {
    const playlist = await subsonic.playlists.getOne(playlistId)

    if (playlist && playlist.entry.length > 0) {
      player.setSongList(playlist.entry, 0)
    }
  }

  return (
    <main className="w-full h-full">
      <ShadowHeader>
        <div className="flex gap-2 items-center">
          <h2 className="text-2xl font-semibold tracking-tight">
            {t('sidebar.playlists')}
          </h2>
          <Badge variant="secondary" className="text-foreground/70">
            {playlists.length}
          </Badge>
        </div>
      </ShadowHeader>

      <ListWrapper className="mt-6">
        <DataTable
          columns={memoizedPlaylistsColumns}
          data={playlists}
          showPagination={true}
          showSearch={true}
          searchColumn="name"
          handlePlaySong={(row) => handlePlayPlaylist(row.original.id)}
        />
      </ListWrapper>
    </main>
  )
}
