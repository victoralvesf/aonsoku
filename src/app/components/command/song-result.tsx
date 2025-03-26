import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { CommandGroup, CommandItem } from '@/app/components/ui/command'
import { ROUTES } from '@/routes/routesList'
import { usePlayerActions } from '@/store/player.store'
import { ISong } from '@/types/responses/song'
import {
  CustomGroup,
  CustomGroupHeader,
  CustomHeaderLink,
} from './command-group'
import { CommandItemProps } from './command-menu'
import { ResultItem } from './result-item'

type SongResultProps = CommandItemProps & {
  query: string
  songs: ISong[]
}

export function CommandSongResult({
  query,
  songs,
  runCommand,
}: SongResultProps) {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { playSong } = usePlayerActions()

  return (
    <CustomGroup>
      <CustomGroupHeader>
        <span>{t('sidebar.songs')}</span>
        <CustomHeaderLink
          onClick={() => runCommand(() => navigate(ROUTES.SONGS.SEARCH(query)))}
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
                runCommand(() => navigate(ROUTES.ALBUM.PAGE(song.albumId)))
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
  )
}
