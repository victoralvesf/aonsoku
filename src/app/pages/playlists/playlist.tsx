import { PlaylistWithEntries } from '@/types/responses/playlist';
import { useLoaderData } from 'react-router-dom';
import { getCoverArtUrl } from '@/api/httpClient';
import { songsColumns } from '@/app/tables/songs-columns';
import { DataTable } from '@/app/components/ui/data-table';
import Image from '@/app/components/image';
import { Badge } from '@/app/components/ui/badge';
import { usePlayer } from '@/app/contexts/player-context';
import { convertSecondsToHumanRead } from '@/utils/convertSecondsToTime';
import PlayButtons from '@/app/components/play-buttons';
import { cn } from '@/lib/utils';
import { getTextSizeClass } from '@/utils/getTextSizeClass';
import { ColumnFilter } from '@/types/columnFilter';

export default function Playlist() {
  const playlist = useLoaderData() as PlaylistWithEntries;
  const playlistDuration = convertSecondsToHumanRead(playlist.duration)

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
            Playlist
          </p>
          <h2 className={cn("scroll-m-20 font-extrabold tracking-tight antialiased", getTextSizeClass(playlist.name))}>
            {playlist.name}
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            {playlist.comment}
          </p>
          <div className="flex gap-1 mt-2 text-muted-foreground text-sm">
            <Badge variant="secondary">{playlist.songCount} songs</Badge>
            <Badge variant="secondary">about {playlistDuration}</Badge>
          </div>
        </div>
      </div>

      <PlayButtons
        playButtonTooltip={`Play ${playlist.name}`}
        handlePlayButton={() => player.setSongList(playlist.entry, 0)}
        shuffleButtonTooltip={`Play ${playlist.name} in shuffle mode`}
        handleShuffleButton={() => player.setSongList(playlist.entry, 0, true)}
        optionsTooltip={`More options for ${playlist.name}`}
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