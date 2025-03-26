import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { CommandGroup, CommandItem } from '@/app/components/ui/command'
import { useSongList } from '@/app/hooks/use-song-list'
import { ROUTES } from '@/routes/routesList'
import { usePlayerActions } from '@/store/player.store'
import { Albums } from '@/types/responses/album'
import {
  CustomGroup,
  CustomGroupHeader,
  CustomHeaderLink,
} from './command-group'
import { CommandItemProps } from './command-menu'
import { ResultItem } from './result-item'

type AlbumResultProps = CommandItemProps & {
  query: string
  albums: Albums[]
}

export function CommandAlbumResult({
  query,
  albums,
  runCommand,
}: AlbumResultProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { getAlbumSongs } = useSongList()
  const { setSongList } = usePlayerActions()

  async function handlePlayAlbum(albumId: string) {
    const albumSongs = await getAlbumSongs(albumId)
    if (albumSongs) setSongList(albumSongs, 0)
  }

  return (
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
                runCommand(() => navigate(ROUTES.ALBUM.PAGE(album.id)))
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
  )
}
