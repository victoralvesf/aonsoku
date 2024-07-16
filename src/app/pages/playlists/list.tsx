import { PlusIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'

import { ShadowHeader } from '@/app/components/album/shadow-header'
import { HeaderTitle } from '@/app/components/header-title'
import ListWrapper from '@/app/components/list-wrapper'
import { Button } from '@/app/components/ui/button'
import { DataTable } from '@/app/components/ui/data-table'
import { playlistsColumns } from '@/app/tables/playlists-columns'
import { subsonic } from '@/service/subsonic'
import { usePlayerActions } from '@/store/player.store'
import { usePlaylists } from '@/store/playlists.store'

export default function PlaylistsPage() {
  const { playlists, setPlaylistDialogState } = usePlaylists()
  const { setSongList } = usePlayerActions()
  const { t } = useTranslation()

  const columns = playlistsColumns()

  async function handlePlayPlaylist(playlistId: string) {
    const playlist = await subsonic.playlists.getOne(playlistId)

    if (playlist && playlist.entry.length > 0) {
      setSongList(playlist.entry, 0)
    }
  }

  return (
    <div className="w-full h-full">
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

      <ListWrapper className="pt-[--shadow-header-distance]">
        <DataTable
          columns={columns}
          data={playlists}
          showPagination={true}
          showSearch={true}
          searchColumn="name"
          handlePlaySong={(row) => handlePlayPlaylist(row.original.id)}
          allowRowSelection={false}
        />
      </ListWrapper>
    </div>
  )
}
