import { useQuery } from '@tanstack/react-query'
import { CommandItem } from 'cmdk'
import { PlusIcon } from 'lucide-react'
import { KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import { NoPlaylistsMessage } from '@/app/components/playlist/empty-message'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from '@/app/components/ui/command'
import { ContextMenuItem } from '@/app/components/ui/context-menu'
import { DropdownMenuItem } from '@/app/components/ui/dropdown-menu'
import { ScrollArea } from '@/app/components/ui/scroll-area'
import { subsonic } from '@/service/subsonic'
import { queryKeys } from '@/utils/queryKeys'

interface AddToPlaylistSubMenuProps {
  newPlaylistFn: () => void
  addToPlaylistFn: (id: string) => void
  type?: 'context' | 'dropdown'
}

export function AddToPlaylistSubMenu({
  newPlaylistFn,
  addToPlaylistFn,
  type = 'dropdown',
}: AddToPlaylistSubMenuProps) {
  const { t } = useTranslation()

  const { data: playlists } = useQuery({
    queryKey: [queryKeys.playlist.all],
    queryFn: subsonic.playlists.getAll,
  })

  function avoidTypeAhead(e: KeyboardEvent<HTMLInputElement>) {
    const avoidKeys = ['ArrowLeft', 'ArrowRight', 'Escape']

    if (avoidKeys.includes(e.key) || e.key.length === 1) {
      e.stopPropagation()
    }
  }

  return (
    <>
      <Command>
        <CommandInput
          placeholder={t('options.playlist.search')}
          onKeyDown={avoidTypeAhead}
        />
        <div className="p-1 border-b">
          {type === 'dropdown' ? (
            <DropdownMenuItem
              className="flex p-1 items-center h-10"
              onClick={newPlaylistFn}
              autoFocus={false}
            >
              <PlusIcon className="w-4 h-4 mr-2 ml-1" />
              <span>{t('options.playlist.create')}</span>
            </DropdownMenuItem>
          ) : (
            <ContextMenuItem
              className="flex p-1 items-center h-10"
              onClick={newPlaylistFn}
              autoFocus={false}
            >
              <PlusIcon className="w-4 h-4 mr-2 ml-1" />
              <span>{t('options.playlist.create')}</span>
            </ContextMenuItem>
          )}
        </div>
        <ScrollArea className="h-[300px]" type="always">
          <CommandList className="max-h-fit max-w-[298px]">
            <CommandEmpty className="p-1">
              <NoPlaylistsMessage />
            </CommandEmpty>
            <CommandGroup>
              {playlists &&
                playlists.map((playlist) => (
                  <CommandItem
                    key={playlist.id}
                    value={playlist.name}
                    className="mr-1.5"
                  >
                    {type === 'dropdown' ? (
                      <DropdownMenuItem
                        className="truncate h-10"
                        onClick={() => addToPlaylistFn(playlist.id)}
                      >
                        <span className="truncate pl-1">{playlist.name}</span>
                      </DropdownMenuItem>
                    ) : (
                      <ContextMenuItem
                        className="truncate h-10"
                        onClick={() => addToPlaylistFn(playlist.id)}
                      >
                        <span className="truncate pl-1">{playlist.name}</span>
                      </ContextMenuItem>
                    )}
                  </CommandItem>
                ))}
            </CommandGroup>
          </CommandList>
        </ScrollArea>
      </Command>
    </>
  )
}
