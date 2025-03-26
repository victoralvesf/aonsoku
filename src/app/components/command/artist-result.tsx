import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { CommandGroup, CommandItem } from '@/app/components/ui/command'
import { useSongList } from '@/app/hooks/use-song-list'
import { ROUTES } from '@/routes/routesList'
import { usePlayerActions } from '@/store/player.store'
import { ISimilarArtist } from '@/types/responses/artist'
import { CustomGroup, CustomGroupHeader } from './command-group'
import { CommandItemProps } from './command-menu'
import { ResultItem } from './result-item'

type ArtistResultProps = CommandItemProps & {
  artists: ISimilarArtist[]
}

export function CommandArtistResult({
  artists,
  runCommand,
}: ArtistResultProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { getArtistAllSongs } = useSongList()
  const { setSongList } = usePlayerActions()

  async function handlePlayArtistRadio(artist: ISimilarArtist) {
    const artistSongs = await getArtistAllSongs(artist.name)
    if (artistSongs) setSongList(artistSongs, 0)
  }

  return (
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
                runCommand(() => navigate(ROUTES.ARTIST.PAGE(artist.id)))
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
  )
}
