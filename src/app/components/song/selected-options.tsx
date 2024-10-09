import { Table } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { OptionsButtons } from '@/app/components/options/buttons'

import {
  ContextMenuItem,
  ContextMenuSeparator,
} from '@/app/components/ui/context-menu'
import { useOptions } from '@/app/hooks/use-options'
import { ISong } from '@/types/responses/song'
import { AddToPlaylistSubMenu } from './add-to-playlist'

interface SelectedSongsProps {
  table: Table<ISong>
}

export function SelectedSongsMenuOptions({ table }: SelectedSongsProps) {
  const { t } = useTranslation()
  const songOptions = useOptions()

  const { rows } = table.getFilteredSelectedRowModel()
  const isSingleSelected = rows.length === 1
  const songs = rows.map((row) => row.original)
  const firstSong = songs[0]

  function reset(action: () => void) {
    action()
    table.resetRowSelection()
  }

  async function handlePlayNext() {
    reset(() => songOptions.playNext(songs))
  }

  async function handlePlayLast() {
    reset(() => songOptions.playLast(songs))
  }

  async function handleDownload() {
    if (!isSingleSelected) return

    reset(() => songOptions.startDownload(firstSong.id))
  }

  async function handleAddToPlaylist(id: string) {
    const songIdToAdd = songs.map((s) => s.id)

    reset(() => songOptions.addToPlaylist(id, songIdToAdd))
  }

  async function handleCreateNewPlaylist() {
    const songIdToAdd = songs.map((s) => s.id)

    reset(() => songOptions.createNewPlaylist(firstSong.title, songIdToAdd))
  }

  function handleRemoveSongsFromPlaylist() {
    const songIndexes = rows.map((row) => row.index.toString())

    reset(() => songOptions.removeSongFromPlaylist(songIndexes))
  }

  function handleSongInfoOption() {
    if (!isSingleSelected) return

    reset(() => songOptions.openSongInfo(firstSong.id))
  }

  return (
    <>
      <OptionsButtons.PlayNext
        variant="context"
        onClick={(e) => {
          e.stopPropagation()
          handlePlayNext()
        }}
      />
      <OptionsButtons.PlayLast
        variant="context"
        onClick={(e) => {
          e.stopPropagation()
          handlePlayLast()
        }}
      />
      <ContextMenuSeparator />
      <OptionsButtons.AddToPlaylistOption variant="context">
        <AddToPlaylistSubMenu
          type="context"
          newPlaylistFn={handleCreateNewPlaylist}
          addToPlaylistFn={handleAddToPlaylist}
        />
      </OptionsButtons.AddToPlaylistOption>
      {songOptions.isOnPlaylistPage && (
        <OptionsButtons.RemoveFromPlaylist
          variant="context"
          onClick={(e) => {
            e.stopPropagation()
            handleRemoveSongsFromPlaylist()
          }}
        />
      )}
      {isSingleSelected && (
        <>
          <ContextMenuSeparator />
          <OptionsButtons.Download
            variant="context"
            onClick={(e) => {
              e.stopPropagation()
              handleDownload()
            }}
          />
          <ContextMenuSeparator />
          <OptionsButtons.SongInfo
            variant="context"
            onClick={(e) => {
              e.stopPropagation()
              handleSongInfoOption()
            }}
          />
        </>
      )}
      <ContextMenuSeparator />
      <ContextMenuItem disabled inset>
        {t('table.menu.selectedCount', { count: rows.length })}
      </ContextMenuItem>
    </>
  )
}
