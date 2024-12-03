import { useQuery, useQueryClient } from '@tanstack/react-query'
import delay from 'lodash/delay'
import { Loader2, SearchIcon } from 'lucide-react'
import { KeyboardEvent, useCallback, useState } from 'react'
import { useHotkeys } from 'react-hotkeys-hook'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useDebouncedCallback } from 'use-debounce'
import { Keyboard } from '@/app/components/command/keyboard-key'
import { ResultItem } from '@/app/components/command/result-item'
import { Badge } from '@/app/components/ui/badge'
import { Button } from '@/app/components/ui/button'
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/app/components/ui/command'
import { ScrollArea } from '@/app/components/ui/scroll-area'
import { useSongList } from '@/app/hooks/use-song-list'
import { ROUTES } from '@/routes/routesList'
import { subsonic } from '@/service/subsonic'
import { useAppStore } from '@/store/app.store'
import { usePlayerActions } from '@/store/player.store'
import { usePlaylists } from '@/store/playlists.store'
import { useTheme } from '@/store/theme.store'
import { ISimilarArtist } from '@/types/responses/artist'
import { ScanStatus } from '@/types/responses/library'
import { Theme } from '@/types/themeContext'
import { convertMinutesToMs } from '@/utils/convertSecondsToTime'
import dateTime from '@/utils/dateTime'
import { queryKeys } from '@/utils/queryKeys'
import {
  CustomGroup,
  CustomGroupHeader,
  CustomHeaderLink,
} from './command-group'
import { CustomCommandItem } from './command-item'

type CommandPages = 'HOME' | 'GOTO' | 'THEME' | 'PLAYLISTS' | 'SERVER'

const gotoPages = [
  { route: ROUTES.LIBRARY.HOME, label: 'sidebar.home' },
  { route: ROUTES.LIBRARY.ARTISTS, label: 'sidebar.artists' },
  { route: ROUTES.LIBRARY.SONGS, label: 'sidebar.songs' },
  { route: ROUTES.LIBRARY.ALBUMS, label: 'sidebar.albums' },
  { route: ROUTES.LIBRARY.PLAYLISTS, label: 'sidebar.playlists' },
  { route: ROUTES.LIBRARY.RADIOS, label: 'sidebar.radios' },
]

const themes = [
  { theme: 'light' as Theme, label: 'theme.light' },
  { theme: 'dark' as Theme, label: 'theme.dark' },
  { theme: 'system' as Theme, label: 'theme.system' },
]

export default function CommandMenu() {
  const navigate = useNavigate()
  const { t } = useTranslation()
  const { setTheme } = useTheme()
  const { getArtistAllSongs, getAlbumSongs } = useSongList()
  const { setPlaylistDialogState } = usePlaylists()
  const { setSongList, playSong } = usePlayerActions()
  const { open, setOpen } = useAppStore((state) => state.command)

  const [query, setQuery] = useState('')
  const [scanStatus, setScanStatus] = useState<ScanStatus>({} as ScanStatus)
  const [loadingStatus, setLoadingStatus] = useState(false)
  const [pages, setPages] = useState<CommandPages[]>(['HOME'])

  const activePage = pages[pages.length - 1]
  const isHome = activePage === 'HOME'

  const enableQuery = Boolean(query.length >= 3 && activePage !== 'PLAYLISTS')

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

  const { data: playlists } = useQuery({
    queryKey: [queryKeys.playlist.all],
    queryFn: subsonic.playlists.getAll,
  })

  useHotkeys(['/', 'mod+f'], () => setOpen(!open), {
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

  async function handlePlayArtistRadio(artist: ISimilarArtist) {
    const artistSongs = await getArtistAllSongs(artist.name)
    if (artistSongs) setSongList(artistSongs, 0)
  }

  async function handlePlayAlbum(albumId: string) {
    const albumSongs = await getAlbumSongs(albumId)
    if (albumSongs) setSongList(albumSongs, 0)
  }

  async function getScanStatus() {
    setLoadingStatus(true)
    delay(async () => {
      const response = await subsonic.library.getScanStatus()

      if (response) setScanStatus(response)
      setLoadingStatus(false)
    }, 1000)
  }

  const queryClient = useQueryClient()

  async function startScan() {
    setLoadingStatus(true)
    delay(async () => {
      const response = await subsonic.library.startScan()

      if (response) {
        setScanStatus(response)
        await queryClient.invalidateQueries()

        useAppStore.setState((state) => {
          state.data.songCount = null
        })
      }

      setLoadingStatus(false)
    }, 2000)
  }

  const inputPlaceholder = () => {
    if (activePage === 'PLAYLISTS') return t('options.playlist.search')

    return t('command.inputPlaceholder')
  }

  const showNotFoundMessage = Boolean(
    enableQuery && !showAlbumGroup && !showArtistGroup && !showSongGroup,
  )

  const lastScanDate = scanStatus.lastScan
    ? dateTime(scanStatus.lastScan).format('LLLL')
    : ''

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

        <Keyboard text="/" />
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
            <CommandList className="max-h-fit p-0.5">
              <CommandEmpty>{t('command.noResults')}</CommandEmpty>

              {showNotFoundMessage && (
                <div className="flex justify-center items-center p-4 mt-2 mx-2 bg-accent/40 rounded border border-border">
                  <p className="text-sm">{t('command.noResults')}</p>
                </div>
              )}

              {showAlbumGroup && (
                <CustomGroup>
                  <CustomGroupHeader>
                    <span>{t('sidebar.albums')}</span>
                    <CustomHeaderLink
                      onClick={() =>
                        runCommand(() => navigate(ROUTES.ALBUMS.SEARCH(query)))
                      }
                    >
                      {t('generic.seeMore')}
                    </CustomHeaderLink>
                  </CustomGroupHeader>
                  <CommandGroup>
                    {albums.length > 0 &&
                      albums.map((album) => (
                        <CommandItem
                          key={`album-${album.id}`}
                          value={`album-${album.id}`}
                          className="border mb-1"
                          onSelect={() => {
                            runCommand(() =>
                              navigate(ROUTES.ALBUM.PAGE(album.id)),
                            )
                          }}
                        >
                          <ResultItem
                            coverArt={album.coverArt}
                            coverArtType="album"
                            title={album.name}
                            artist={album.artist}
                            onClick={() => handlePlayAlbum(album.id)}
                          />
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CustomGroup>
              )}

              {showSongGroup && (
                <CustomGroup>
                  <CustomGroupHeader>
                    <span>{t('sidebar.songs')}</span>
                    <CustomHeaderLink
                      onClick={() =>
                        runCommand(() => navigate(ROUTES.SONGS.SEARCH(query)))
                      }
                    >
                      {t('generic.seeMore')}
                    </CustomHeaderLink>
                  </CustomGroupHeader>
                  <CommandGroup>
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
                            coverArtType="song"
                            title={song.title}
                            artist={song.artist}
                            onClick={() => playSong(song)}
                          />
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CustomGroup>
              )}

              {showArtistGroup && (
                <CustomGroup>
                  <CustomGroupHeader>
                    <span>{t('sidebar.artists')}</span>
                  </CustomGroupHeader>
                  <CommandGroup>
                    {artists.length > 0 &&
                      artists.map((artist) => (
                        <CommandItem
                          key={`artist-${artist.id}`}
                          value={`artist-${artist.id}`}
                          className="border mb-1"
                          onSelect={() => {
                            runCommand(() =>
                              navigate(ROUTES.ARTIST.PAGE(artist.id)),
                            )
                          }}
                        >
                          <ResultItem
                            coverArt={artist.coverArt}
                            coverArtType="artist"
                            title={artist.name}
                            artist={t('artist.info.albumsCount', {
                              count: artist.albumCount,
                            })}
                            onClick={() => handlePlayArtistRadio(artist)}
                          />
                        </CommandItem>
                      ))}
                  </CommandGroup>
                </CustomGroup>
              )}

              {isHome && (
                <CommandGroup heading={t('command.commands.heading')}>
                  <CommandItem onSelect={() => setPages([...pages, 'GOTO'])}>
                    <CustomCommandItem variant="GotoPage">
                      {t('command.commands.pages')}
                    </CustomCommandItem>
                  </CommandItem>
                  <CommandItem onSelect={() => setPages([...pages, 'THEME'])}>
                    <CustomCommandItem variant="ChangeTheme">
                      {t('command.commands.theme')}
                    </CustomCommandItem>
                  </CommandItem>
                  <CommandItem
                    onSelect={() => setPages([...pages, 'PLAYLISTS'])}
                  >
                    <CustomCommandItem variant="Playlists">
                      {t('sidebar.playlists')}
                    </CustomCommandItem>
                  </CommandItem>
                  <CommandItem
                    onSelect={() =>
                      runCommand(() => setPlaylistDialogState(true))
                    }
                  >
                    <CustomCommandItem variant="CreatePlaylist">
                      {t('playlist.form.create.title')}
                    </CustomCommandItem>
                  </CommandItem>
                  <CommandItem
                    onSelect={async () => {
                      await getScanStatus()
                      setPages([...pages, 'SERVER'])
                    }}
                  >
                    <CustomCommandItem variant="ServerManagement">
                      {t('server.management')}
                    </CustomCommandItem>
                  </CommandItem>
                </CommandGroup>
              )}

              {activePage === 'GOTO' && (
                <CommandGroup heading={t('command.pages')}>
                  {gotoPages.map(({ route, label }) => (
                    <CommandItem
                      key={route}
                      onSelect={() => runCommand(() => navigate(route))}
                    >
                      {t(label)}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {activePage === 'THEME' && (
                <CommandGroup heading={t('theme.label')}>
                  {themes.map(({ theme, label }) => (
                    <CommandItem
                      key={label}
                      onSelect={() => runCommand(() => setTheme(theme))}
                    >
                      {t(label)}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}

              {activePage === 'PLAYLISTS' && (
                <CommandGroup heading={t('sidebar.playlists')}>
                  {playlists &&
                    playlists.length > 0 &&
                    playlists.map((playlist) => (
                      <CommandItem
                        key={`playlist-${playlist.id}`}
                        value={playlist.name}
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

              {activePage === 'SERVER' && (
                <CommandGroup heading={t('server.management')}>
                  {loadingStatus ? (
                    <div className="flex justify-center items-center p-2 mb-2">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-2 p-2">
                      <p className="text-sm">{t('server.status')}</p>

                      <div className="flex gap-2 flex-wrap">
                        {scanStatus.count && (
                          <Badge variant="outline">
                            {t('server.songCount', {
                              count: parseInt(scanStatus.count),
                            })}
                          </Badge>
                        )}
                        {scanStatus.folderCount && (
                          <Badge variant="outline">
                            {t('server.folderCount', {
                              count: parseInt(scanStatus.folderCount),
                            })}
                          </Badge>
                        )}
                        {scanStatus.lastScan && (
                          <Badge variant="outline">
                            {t('server.lastScan', {
                              date: lastScanDate,
                            })}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}
                  <CommandItem
                    disabled={loadingStatus}
                    onSelect={() => getScanStatus()}
                  >
                    {t('server.buttons.refresh')}
                  </CommandItem>
                  <CommandItem
                    disabled={loadingStatus}
                    onSelect={() => startScan()}
                  >
                    {t('server.buttons.startScan')}
                  </CommandItem>
                </CommandGroup>
              )}
            </CommandList>
          </ScrollArea>
          <div className="flex justify-end p-2 h-10 gap-1 border-t relative">
            <Keyboard text="ESC" className="static text-sm" />
            <Keyboard text="↓" className="static text-sm" />
            <Keyboard text="↑" className="static text-sm" />
            <Keyboard text="↵" className="static text-sm" />
          </div>
        </Command>
      </CommandDialog>
    </>
  )
}
