import { PlaylistWithEntries } from '@/types/responses/playlist';
import { useLoaderData } from 'react-router-dom';
import { getCoverArtUrl } from '@/api/httpClient';
import { playlistSongsColumns } from '@/tables/playlist/songs-columns';
import { DataTable } from '@/app/components/ui/data-table';
import { formatPlaylistDuration } from '@/utils/dateTime';

export default function GetPlaylist() {
  const playlist = useLoaderData() as PlaylistWithEntries;

  const playlistDuration = formatPlaylistDuration(playlist.duration)

  return (
    <main>
      <div className="space-y-1 mb-8 flex">
        <img src={getCoverArtUrl(playlist.coverArt)} alt={playlist.name} width={250} height={250} className="rounded-lg shadow-md" />
        <div className="ml-6">
          <p className="text-sm text-muted-foreground mt-6">
            Playlist
          </p>
          <h2 className="text-6xl font-bold tracking-tight mt-2 mb-4">
            {playlist.name}
          </h2>
          <p className="text-sm text-muted-foreground">
            {playlist.comment}
          </p>
          <div className="flex gap-1 mt-4 text-muted-foreground text-sm">
            <span className="">{playlist.songCount} songs</span>
            <span className="">•</span>
            <span className="">about {playlistDuration}</span>
          </div>
        </div>
      </div>

      <DataTable columns={playlistSongsColumns} data={playlist.entry} />
    </main>
  )
}