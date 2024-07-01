import { SearchIcon } from 'lucide-react'
import { ChangeEvent, useCallback, useEffect, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'

import { Keyboard } from '@/app/components/command/keyboard-key'
import { ResultItem } from '@/app/components/command/result-item'
import { Button } from '@/app/components/ui/button'
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandList,
} from '@/app/components/ui/command'
import { useApp } from '@/app/contexts/app-context'
import { usePlayer } from '@/app/contexts/player-context'
import { usePlaylists } from '@/app/contexts/playlists-context'
import { useTheme } from '@/app/contexts/theme-context'
import { useSongList } from '@/app/hooks/use-song-list'
import { ROUTES } from '@/routes/routesList'
import { subsonic } from '@/service/subsonic'
import { Albums } from '@/types/responses/album'
import { ISimilarArtist } from '@/types/responses/artist'
import { ISong } from '@/types/responses/song'
import { isTauri } from '@/utils/tauriTools'

type CommandPages = 'HOME' | 'GOTO' | 'THEME' | 'PLAYLISTS'

export default function CommandMenu() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [albums, setAlbums] = useState<Albums[]>([])
  const [artists, setArtists] = useState<ISimilarArtist[]>([])
  const [songs, setSongs] = useState<ISong[]>([])

  const [pages, setPages] = useState<CommandPages[]>(['HOME'])
  const activePage = pages[pages.length - 1]
  const isHome = activePage === 'HOME'

  const navigate = useNavigate()
  const { t } = useTranslation()
  const { setTheme } = useTheme()
  const { osType } = useApp()
  const { getArtistAllSongs, getAlbumSongs } = useSongList()
  const { playlists, setPlaylistDialogState } = usePlaylists()
  const player = usePlayer()

  const isMacOS = osType === 'Darwin'
  const isBrowser = !isTauri()

  const showAlbumGroup = Boolean(query && albums && albums.length > 0)
  const showArtistGroup = Boolean(query && artists && artists.length > 0)
  const showSongGroup = Boolean(query && songs && songs.length > 0)

  useHotkeys('mod+k', () => setOpen((state) => !state))

  const clear = useCallback(() => {
    setQuery('')
    setAlbums([])
    setArtists([])
    setSongs([])
    setPages(['HOME'])
  }, [])

  const runCommand = useCallback(
    (command: () => unknown) => {
      setOpen(false)
      clear()
      command()
    },
    [clear],
  )

  function handleSearchChange(event: ChangeEvent<HTMLInputElement>) {
    setQuery(event.target.value)
  }

  useEffect(() => {
    if (query.length === 0) clear()

    if (query.length >= 3) search(query)
  }, [query, clear])

  const removeLastPage = useCallback(() => {
    setPages((pages) => {
      const tempPages = [...pages]
      tempPages.splice(-1, 1)
      return tempPages
    })
  }, [])

  async function search(searchQuery: string) {
    const response = await subsonic.search.get({
      query: searchQuery,
      albumCount: 4,
      artistCount: 4,
      songCount: 4,
    })

    if (response) {
      setAlbums(response.album || [])
      setArtists(response.artist || [])
      setSongs(response.song || [])
    }
  }

  async function handlePlayArtistRadio(artist: ISimilarArtist) {
    const artistSongs = await getArtistAllSongs(artist.name)
    if (artistSongs) player.setSongList(artistSongs, 0)
  }

  async function handlePlayAlbum(albumId: string) {
    const albumSongs = await getAlbumSongs(albumId)
    if (albumSongs) player.setSongList(albumSongs, 0)
  }

  const modifierKey = () => {
    const keys = { mac: '⌘', win: '⌃' }

    if (isBrowser || isMacOS) return keys.mac
    if (!isBrowser && !isMacOS) return keys.win
  }

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

        <Keyboard modifier={modifierKey()} text="K" />
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
        <input
          type="text"
          id="search"
          placeholder={t('command.inputPlaceholder')}
          className="px-4 py-3 bg-background border-b outline-none focus:border-b-primary"
          value={query}
          autoCorrect="false"
          autoCapitalize="false"
          spellCheck="false"
          onChange={handleSearchChange}
        />
        <CommandList className="max-h-[500px] 2xl:max-h-[700px]">
          <CommandEmpty>{t('command.noResults')}</CommandEmpty>

          {showAlbumGroup && (
            <CommandGroup heading={t('sidebar.albums')}>
              {albums.length > 0 &&
                albums.map((album) => (
                  <CommandItem
                    key={`album-${album.id}`}
                    value={`album-${album.id}`}
                    className="border mb-1"
                    onSelect={() => {
                      runCommand(() => navigate(ROUTES.ALBUM.PAGE(album.id)))
                    }}
                  >
                    <ResultItem
                      coverArt={album.coverArt}
                      title={album.title}
                      artist={album.artist}
                      onClick={() => handlePlayAlbum(album.id)}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          )}

          {showArtistGroup && (
            <CommandGroup heading={t('sidebar.artists')}>
              {artists.length > 0 &&
                artists.map((artist) => (
                  <CommandItem
                    key={`artist-${artist.id}`}
                    value={`artist-${artist.id}`}
                    className="border mb-1"
                    onSelect={() => {
                      runCommand(() => navigate(ROUTES.ARTIST.PAGE(artist.id)))
                    }}
                  >
                    <ResultItem
                      coverArt={artist.coverArt}
                      title={artist.name}
                      artist={t('artist.info.albumsCount', {
                        count: artist.albumCount,
                      })}
                      onClick={() => handlePlayArtistRadio(artist)}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          )}

          {showSongGroup && (
            <CommandGroup heading={t('sidebar.songs')}>
              {songs.length > 0 &&
                songs.map((song) => (
                  <CommandItem
                    key={`song-${song.id}`}
                    value={`song-${song.id}`}
                    className="border mb-1"
                    onSelect={() => {
                      runCommand(() =>
                        navigate(ROUTES.ALBUM.PAGE(song.albumId)),
                      )
                    }}
                  >
                    <ResultItem
                      coverArt={song.coverArt}
                      title={song.title}
                      artist={song.artist}
                      onClick={() => player.playSong(song)}
                    />
                  </CommandItem>
                ))}
            </CommandGroup>
          )}

          {isHome && (
            <CommandGroup heading={t('command.commands.heading')}>
              <CommandItem onSelect={() => setPages([...pages, 'GOTO'])}>
                {t('command.commands.pages')}
              </CommandItem>
              <CommandItem onSelect={() => setPages([...pages, 'THEME'])}>
                {t('command.commands.theme')}
              </CommandItem>
              <CommandItem onSelect={() => setPages([...pages, 'PLAYLISTS'])}>
                {t('sidebar.playlists')}
              </CommandItem>
              <CommandItem
                onSelect={() => runCommand(() => setPlaylistDialogState(true))}
              >
                {t('playlist.createDialog.title')}
              </CommandItem>
            </CommandGroup>
          )}

          {activePage === 'GOTO' && (
            <CommandGroup heading={t('command.pages')}>
              <CommandItem
                onSelect={() => runCommand(() => navigate(ROUTES.LIBRARY.HOME))}
              >
                {t('sidebar.home')}
              </CommandItem>
              <CommandItem
                onSelect={() =>
                  runCommand(() => navigate(ROUTES.LIBRARY.ARTISTS))
                }
              >
                {t('sidebar.artists')}
              </CommandItem>
              <CommandItem
                onSelect={() =>
                  runCommand(() => navigate(ROUTES.LIBRARY.SONGS))
                }
              >
                {t('sidebar.songs')}
              </CommandItem>
              <CommandItem
                onSelect={() =>
                  runCommand(() => navigate(ROUTES.LIBRARY.ALBUMS))
                }
              >
                {t('sidebar.albums')}
              </CommandItem>
              <CommandItem
                onSelect={() =>
                  runCommand(() => navigate(ROUTES.LIBRARY.PLAYLISTS))
                }
              >
                {t('sidebar.playlists')}
              </CommandItem>
              <CommandItem
                onSelect={() =>
                  runCommand(() => navigate(ROUTES.LIBRARY.RADIOS))
                }
              >
                {t('sidebar.radios')}
              </CommandItem>
            </CommandGroup>
          )}

          {activePage === 'THEME' && (
            <CommandGroup heading={t('theme.label')}>
              <CommandItem onSelect={() => runCommand(() => setTheme('light'))}>
                {t('theme.light')}
              </CommandItem>
              <CommandItem onSelect={() => runCommand(() => setTheme('dark'))}>
                {t('theme.dark')}
              </CommandItem>
              <CommandItem
                onSelect={() => runCommand(() => setTheme('system'))}
              >
                {t('theme.system')}
              </CommandItem>
            </CommandGroup>
          )}

          {activePage === 'PLAYLISTS' && (
            <CommandGroup heading={t('sidebar.playlists')}>
              {playlists.length > 0 &&
                playlists.map((playlist) => (
                  <CommandItem
                    key={`playlist-${playlist.id}`}
                    value={`playlist-${playlist.id}`}
                    onSelect={() =>
                      runCommand(() =>
                        navigate(ROUTES.PLAYLIST.PAGE(playlist.id)),
                      )
                    }
                  >
                    {playlist.name}
                  </CommandItem>
                ))}
            </CommandGroup>
          )}
        </CommandList>
        <div className="flex justify-end p-2 h-10 gap-1 border-t relative">
          <Keyboard text="ESC" className="static text-sm" />
          <Keyboard text="↓" className="static text-sm" />
          <Keyboard text="↑" className="static text-sm" />
          <Keyboard text="↵" className="static text-sm" />
        </div>
      </CommandDialog>
    </>
  )
}
