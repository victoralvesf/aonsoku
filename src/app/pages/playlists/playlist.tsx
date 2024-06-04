import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { PlaylistWithEntries } from '@/types/responses/playlist';
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
import { PlaylistOptions } from '@/app/components/playlist/options';
import { RemovePlaylistDialog } from '@/app/components/playlist/remove-dialog';

export default function Playlist() {
  const playlist = useLoaderData() as PlaylistWithEntries;
  const [removeDialogState, setRemoveDialogState] = useState(false)

  const playlistDuration = playlist.duration > 0 ? convertSecondsToHumanRead(playlist.duration) : undefined;
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
          className="rounded-lg shadow-md resize-none bg-background"
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
            {playlistDuration && (
              <Badge variant="secondary">
                {t('playlist.duration', { duration: playlistDuration })}
              </Badge>
            )}
          </div>
        </div>
      </div>

      <PlayButtons
        playButtonTooltip={buttonsTooltips.play}
        handlePlayButton={() => player.setSongList(playlist.entry, 0)}
        disablePlayButton={!playlist.entry}
        shuffleButtonTooltip={buttonsTooltips.shuffle}
        handleShuffleButton={() => player.setSongList(playlist.entry, 0, true)}
        disableShuffleButton={!playlist.entry}
        optionsTooltip={buttonsTooltips.options}
        showLikeButton={false}
        optionsMenuItems={
          <PlaylistOptions
            playlist={playlist}
            onRemovePlaylist={() => setRemoveDialogState(true)}
            disablePlayNext={!playlist.entry}
            disableAddLast={!playlist.entry}
            disableDownload={!playlist.entry}
          />
        }
      />

      <RemovePlaylistDialog
        playlistId={playlist.id}
        openDialog={removeDialogState}
        setOpenDialog={setRemoveDialogState}
      />

      {playlist.entry && playlist.entry.length > 0 ? (
        <DataTable
          columns={songsColumns}
          data={playlist.entry}
          handlePlaySong={(row) => player.setSongList(playlist.entry, row.index)}
          columnFilter={columnsToShow}
        />
      ) : (
        <div className="flex items-center pt-6">
          <p className="text-lg text-muted-foreground">
            {t('playlist.noSongList')}
          </p>
        </div>
      )}
    </main>
  )
}