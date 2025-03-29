import { useQuery } from '@tanstack/react-query'
import { SearchIcon } from 'lucide-react'
import { KeyboardEvent, useCallback, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useTranslation } from 'react-i18next'
import { useDebouncedCallback } from 'use-debounce'
import { Keyboard } from '@/app/components/command/keyboard-key'
import { Button } from '@/app/components/ui/button'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandInput,
  CommandList,
} from '@/app/components/ui/command'
import { ScrollArea } from '@/app/components/ui/scroll-area'
import { subsonic } from '@/service/subsonic'
import { useAppStore } from '@/store/app.store'
import { byteLength } from '@/utils/byteLength'
import { convertMinutesToMs } from '@/utils/convertSecondsToTime'
import { queryKeys } from '@/utils/queryKeys'
import { CommandAlbumResult } from './album-result'
import { CommandArtistResult } from './artist-result'
import { CommandGotoPage } from './goto-page'
import { CommandHome, CommandPages } from './home'
import { CommandPlaylists } from './playlists'
import { CommandServer } from './server-management'
import { CommandSongResult } from './song-result'
import { CommandThemes } from './themes'

export type CommandItemProps = {
  runCommand: (command: () => unknown) => void
}

export default function CommandMenu() {
  const { t } = useTranslation()
  const { open, setOpen } = useAppStore((state) => state.command)

  const [query, setQuery] = useState('')
  const [pages, setPages] = useState<CommandPages[]>(['HOME'])

  const activePage = pages[pages.length - 1]
  const isHome = activePage === 'HOME'

  const enableQuery = Boolean(
    byteLength(query) >= 3 && activePage !== 'PLAYLISTS',
  )

  const { data: searchResult } = useQuery({
    queryKey: [queryKeys.search, query],
    queryFn: () =>
      subsonic.search.get({
        query,
        albumCount: 4,
        artistCount: 4,
        songCount: 4,
      }),
    enabled: enableQuery,
    staleTime: convertMinutesToMs(5),
  })

  const albums = searchResult?.album ?? []
  const artists = searchResult?.artist ?? []
  const songs = searchResult?.song ?? []

  const showAlbumGroup = Boolean(query && albums.length > 0)
  const showArtistGroup = Boolean(query && artists.length > 0)
  const showSongGroup = Boolean(query && songs.length > 0)

  useHotkeys(['/', 'mod+f', 'mod+k'], () => setOpen(!open), {
    preventDefault: true,
  })

  const clear = useCallback(() => {
    setQuery('')
    setPages(['HOME'])
  }, [])

  const runCommand = useCallback(
    (command: () => unknown) => {
      setOpen(false)
      clear()
      command()
    },
    [clear, setOpen],
  )

  const debounced = useDebouncedCallback((value: string) => {
    setQuery(value)
  }, 500)

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === '/') {
      event.preventDefault()
    }
  }

  function handleSearchChange(value: string) {
    if (activePage === 'PLAYLISTS') {
      setQuery(value)
    } else {
      debounced(value)
    }
  }

  const removeLastPage = useCallback(() => {
    setPages((pages) => {
      const tempPages = [...pages]
      tempPages.splice(-1, 1)
      return tempPages
    })
  }, [])

  const inputPlaceholder = () => {
    if (activePage === 'PLAYLISTS') return t('options.playlist.search')

    return t('command.inputPlaceholder')
  }

  const showNotFoundMessage = Boolean(
    enableQuery && !showAlbumGroup && !showArtistGroup && !showSongGroup,
  )

  return (
    <>
      <Button
        variant="outline"
        className="flex justify-start w-full px-2 gap-2 relative"
        onClick={() => setOpen(true)}
      >
        <SearchIcon className="h-4 w-4 text-muted-foreground" />
        <span className="inline-flex text-muted-foreground text-sm">
          {t('sidebar.search')}
        </span>

        <div className="absolute right-2">
          <Keyboard text="/" />
        </div>
      </Button>
      <CommandDialog
        open={open}
        onOpenChange={(state) => {
          if (isHome) {
            setOpen(state)
            clear()
          } else {
            removeLastPage()
          }
        }}
      >
        <Command shouldFilter={activePage === 'PLAYLISTS'} id="main-command">
          <CommandInput
            data-testid="command-menu-input"
            placeholder={inputPlaceholder()}
            autoCorrect="false"
            autoCapitalize="false"
            spellCheck="false"
            onValueChange={(value) => handleSearchChange(value)}
            onKeyDown={handleInputKeyDown}
          />
          <ScrollArea className="max-h-[500px] 2xl:max-h-[700px]">
            <CommandList className="max-h-fit pr-1">
              <CommandEmpty>{t('command.noResults')}</CommandEmpty>

              {showNotFoundMessage && (
                <div className="flex justify-center items-center p-4 mt-2 mx-2 bg-accent/40 rounded border border-border">
                  <p className="text-sm">{t('command.noResults')}</p>
                </div>
              )}

              {showAlbumGroup && (
                <CommandAlbumResult
                  query={query}
                  albums={albums}
                  runCommand={runCommand}
                />
              )}

              {showSongGroup && (
                <CommandSongResult
                  query={query}
                  songs={songs}
                  runCommand={runCommand}
                />
              )}

              {showArtistGroup && (
                <CommandArtistResult
                  artists={artists}
                  runCommand={runCommand}
                />
              )}

              {isHome && (
                <CommandHome
                  pages={pages}
                  setPages={setPages}
                  runCommand={runCommand}
                />
              )}

              {activePage === 'GOTO' && (
                <CommandGotoPage runCommand={runCommand} />
              )}

              {activePage === 'THEME' && (
                <CommandThemes runCommand={runCommand} />
              )}

              {activePage === 'PLAYLISTS' && (
                <CommandPlaylists runCommand={runCommand} />
              )}

              {activePage === 'SERVER' && <CommandServer />}
            </CommandList>
          </ScrollArea>
          <div className="flex justify-end p-2 h-10 gap-1 border-t">
            <Keyboard text="ESC" className="text-sm" />
            <Keyboard text="↓" className="text-sm" />
            <Keyboard text="↑" className="text-sm" />
            <Keyboard text="↵" className="text-sm" />
          </div>
        </Command>
      </CommandDialog>
    </>
  )
}
