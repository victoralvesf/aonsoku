import { OptionsButtons } from '@/app/components/options/buttons'
import { ContextMenuSeparator } from '@/app/components/ui/context-menu'
import { AddToPlaylistSubMenu } from '@/app/components/song/add-to-playlist'
import { useOptions } from '@/app/hooks/use-options'
import { useAppStore } from '@/store/app.store'
import { usePlayerActions } from '@/store/player.store'
import { ISong } from '@/types/responses/song'

interface QueueMenuOptionsProps {
  song: ISong
}

export function QueueMenuOptions({ song }: QueueMenuOptionsProps) {
  const { createNewPlaylist, addToPlaylist } = useOptions()
  const hidePlaylistsSection = useAppStore().pages.hidePlaylistsSection
  const { removeSongFromQueue } = usePlayerActions()

  return (
    <>
      {!hidePlaylistsSection && (
        <>
          <OptionsButtons.AddToPlaylistOption variant="context">
            <AddToPlaylistSubMenu
              type="context"
              newPlaylistFn={() => createNewPlaylist(song.title, song.id)}
              addToPlaylistFn={(id) => addToPlaylist(id, song.id)}
            />
          </OptionsButtons.AddToPlaylistOption>
          <ContextMenuSeparator />
        </>
      )}
      <OptionsButtons.RemoveFromQueue
        variant="context"
        onClick={(e) => {
          e.stopPropagation()
          removeSongFromQueue(song.id)
        }}
      />
    </>
  )
}
