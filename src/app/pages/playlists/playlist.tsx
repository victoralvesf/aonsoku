import { PlaylistWithEntries } from '@/types/responses/playlist';
import { useLoaderData } from 'react-router-dom';
import { getCoverArtUrl } from '@/api/httpClient';
import { songsColumns } from '@/app/tables/songs-columns';
import { DataTable } from '@/app/components/ui/data-table';
import Image from '@/app/components/image';
import { Badge } from '@/app/components/ui/badge';
import { usePlayer } from '@/app/contexts/player-context';
import { convertSecondsToHumanRead } from '@/utils/convertSecondsToTime';
import PlayButtons from '@/app/components/album/play-buttons';
import { cn } from '@/lib/utils';
import { getTextSizeClass } from '@/utils/getTextSizeClass';
import { ColumnFilter } from '@/types/columnFilter';
import { useTranslation } from 'react-i18next';

export default function Playlist() {
  const playlist = useLoaderData() as PlaylistWithEntries;
  const playlistDuration = convertSecondsToHumanRead(playlist.duration)
  const { t } = useTranslation()
  const player = usePlayer()

  const columnsToShow: ColumnFilter[] = [
    'index',
    'title',
    'artist',
    'album',
    'duration',
    'playCount',
    'contentType',
    'starred'
  ]

  const buttonsTooltips = {
    play: t('playlist.buttons.play', { name: playlist.name }),
    shuffle: t('playlist.buttons.shuffle', { name: playlist.name }),
    options: t('playlist.buttons.options', { name: playlist.name })
  }

  return (
    <main className="w-full">
      <div className="flex">
        <Image
          src={getCoverArtUrl(playlist.coverArt)}
          alt={playlist.name}
          width={250}
          height={250}
          className="rounded-lg shadow-md resize-none"
        />
        <div className="ml-4 w-full flex flex-col justify-end">
          <p className="text-sm mb-2">
            {t('playlist.headline')}
          </p>
          <h2 className={cn("scroll-m-20 font-bold tracking-tight antialiased", getTextSizeClass(playlist.name))}>
            {playlist.name}
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            {playlist.comment}
          </p>
          <div className="flex gap-1 mt-2 text-muted-foreground text-sm">
            <Badge variant="secondary">
              {t('playlist.songCount', { count: playlist.songCount })}
            </Badge>
            <Badge variant="secondary">
              {t('playlist.duration', { duration: playlistDuration })}
            </Badge>
          </div>
        </div>
      </div>

      <PlayButtons
        playButtonTooltip={buttonsTooltips.play}
        handlePlayButton={() => player.setSongList(playlist.entry, 0)}
        shuffleButtonTooltip={buttonsTooltips.shuffle}
        handleShuffleButton={() => player.setSongList(playlist.entry, 0, true)}
        optionsTooltip={buttonsTooltips.options}
        showLikeButton={false}
      />

      <DataTable
        columns={songsColumns}
        data={playlist.entry}
        handlePlaySong={(row) => player.setSongList(playlist.entry, row.index)}
        columnFilter={columnsToShow}
      />
    </main>
  )
}