import { useQuery } from '@tanstack/react-query'
import { CommandItem } from 'cmdk'
import { PlusIcon } from 'lucide-react'
import { KeyboardEvent } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandList,
} from '@/app/components/ui/command'
import { ContextMenuItem } from '@/app/components/ui/context-menu'
import { DropdownMenuItem } from '@/app/components/ui/dropdown-menu'
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
        <CommandList>
          <CommandEmpty>{t('options.playlist.notFound')}</CommandEmpty>
          <CommandGroup>
            {playlists &&
              playlists.map((playlist) => (
                <CommandItem key={playlist.id} value={playlist.name}>
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
      </Command>
    </>
  )
}
