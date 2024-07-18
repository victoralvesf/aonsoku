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
import {
  DropdownMenuItem,
  DropdownMenuSubContent,
} from '@/app/components/ui/dropdown-menu'
import { usePlaylists } from '@/store/playlists.store'

interface AddToPlaylistSubMenuProps {
  newPlaylistFn: () => void
  addToPlaylistFn: (id: string) => void
}

export function AddToPlaylistSubMenu({
  newPlaylistFn,
  addToPlaylistFn,
}: AddToPlaylistSubMenuProps) {
  const { playlists } = usePlaylists()
  const { t } = useTranslation()

  function avoidTypeAhead(e: KeyboardEvent<HTMLInputElement>) {
    const avoidKeys = ['ArrowLeft', 'ArrowRight', 'Escape']

    if (avoidKeys.includes(e.key) || e.key.length === 1) {
      e.stopPropagation()
    }
  }

  return (
    <DropdownMenuSubContent className="p-0 max-w-[300px]">
      <Command>
        <CommandInput
          placeholder={t('options.playlist.search')}
          onKeyDown={avoidTypeAhead}
        />
        <div className="p-1 border-b">
          <DropdownMenuItem
            className="flex p-1 items-center h-10"
            onClick={newPlaylistFn}
            autoFocus={false}
          >
            <PlusIcon className="w-4 h-4 mr-2 ml-1" />
            <span>{t('options.playlist.create')}</span>
          </DropdownMenuItem>
        </div>
        <CommandList>
          <CommandEmpty>{t('options.playlist.notFound')}</CommandEmpty>
          <CommandGroup>
            {playlists.map((playlist) => (
              <CommandItem key={playlist.id} value={playlist.name}>
                <DropdownMenuItem
                  className="truncate h-10"
                  onClick={() => addToPlaylistFn(playlist.id)}
                >
                  <span className="truncate pl-1">{playlist.name}</span>
                </DropdownMenuItem>
              </CommandItem>
            ))}
          </CommandGroup>
        </CommandList>
      </Command>
    </DropdownMenuSubContent>
  )
}
