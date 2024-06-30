import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { PlusIcon } from 'lucide-react'

import ListWrapper from '@/app/components/list-wrapper'
import { ShadowHeader } from '@/app/components/shadow-header'
import { DataTable } from '@/app/components/ui/data-table'
import { useLang } from '@/app/contexts/lang-context'
import { usePlayer } from '@/app/contexts/player-context'
import { usePlaylists } from '@/app/contexts/playlists-context'
import { playlistsColumns } from '@/app/tables/playlists-columns'
import { subsonic } from '@/service/subsonic'
import { HeaderTitle } from '@/app/components/header-title'
import { Button } from '@/app/components/ui/button'

export default function PlaylistsPage() {
  const { langCode } = useLang()
  const { playlists, setPlaylistDialogState } = usePlaylists()
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
        <div className="w-full flex items-center justify-between">
          <HeaderTitle
            title={t('sidebar.playlists')}
            count={playlists.length}
          />
        </div>

        <Button
          size="sm"
          variant="default"
          className="px-4"
          onClick={() => setPlaylistDialogState(true)}
        >
          <PlusIcon className="w-5 h-5 -ml-[3px]" />
          <span className="ml-2">{t('playlist.form.create.title')}</span>
        </Button>
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
