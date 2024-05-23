import { PlaylistWithEntries } from '@/types/responses/playlist';
import { useLoaderData } from 'react-router-dom';
import { getCoverArtUrl } from '@/api/httpClient';
import { playlistSongsColumns } from '@/app/tables/playlist/songs-columns';
import { DataTable } from '@/app/components/ui/data-table';
import { formatPlaylistDuration } from '@/utils/dateTime';
import Image from '@/app/components/image';
import { Button } from '@/app/components/ui/button';
import { EllipsisVertical, Play, Shuffle } from 'lucide-react';
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip';
import { Badge } from '@/app/components/ui/badge';

export default function Playlist() {
  const playlist = useLoaderData() as PlaylistWithEntries;
  const playlistDuration = formatPlaylistDuration(playlist.duration)

  return (
    <main>
      <div className="flex">
        <Image
          src={getCoverArtUrl(playlist.coverArt)}
          alt={playlist.name}
          width={250}
          height={250}
          className="rounded-lg shadow-md resize-none"
        />
        <div className="ml-6 w-full flex flex-col justify-start">
          <p className="text-sm text-muted-foreground mb-2">
            Playlist
          </p>
          <h2 className="text-6xl font-bold tracking-tight">
            {playlist.name}
          </h2>
          <p className="text-sm text-muted-foreground mt-2">
            {playlist.comment}
          </p>
          <div className="flex gap-1 mt-2 text-muted-foreground text-sm">
            <Badge className="font-medium hover:bg-primary">{playlist.songCount} songs</Badge>
            <Badge className="font-medium hover:bg-primary">about {playlistDuration}</Badge>
          </div>
        </div>
      </div>

      <div className="w-full mt-6 mb-6 flex items-center gap-4">
        <SimpleTooltip text={`Play ${playlist.name}`}>
          <Button className="rounded-full w-14 h-14 hover:scale-[0.97] transform-gpu" variant="default">
            <Play className="w-4 h-4 fill-slate-50 text-slate-50" strokeWidth={6} />
          </Button>
        </SimpleTooltip>

        <SimpleTooltip text={`Play ${playlist.name} in shuffle mode`}>
          <Button className="rounded-full w-12 h-12" variant="ghost">
            <Shuffle className="w-4 h-4" strokeWidth={3} />
          </Button>
        </SimpleTooltip>

        <SimpleTooltip text={`More options for ${playlist.name}`}>
          <Button className="rounded-full w-12 h-12" variant="ghost">
            <EllipsisVertical className="w-4 h-4" strokeWidth={3} />
          </Button>
        </SimpleTooltip>
      </div>

      <DataTable
        columns={playlistSongsColumns}
        data={playlist.entry}
        handlePlaySong={(row) => console.log(row.original)}
      />
    </main>
  )
}