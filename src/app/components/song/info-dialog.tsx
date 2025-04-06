import { useQuery } from '@tanstack/react-query'
import clsx from 'clsx'
import { Check, Loader2, XIcon } from 'lucide-react'
import { Fragment } from 'react/jsx-runtime'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { Dot } from '@/app/components/dot'
import { Badge } from '@/app/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog'
import { ScrollArea } from '@/app/components/ui/scroll-area'
import { ROUTES } from '@/routes/routesList'
import { subsonic } from '@/service/subsonic'
import { useSongInfo } from '@/store/ui.store'
import { convertSecondsToTime } from '@/utils/convertSecondsToTime'
import dateTime from '@/utils/dateTime'
import { formatBytes } from '@/utils/formatBytes'
import { RECORD_LABELS_MAX_NUMBER } from '@/utils/multipleArtists'
import { queryKeys } from '@/utils/queryKeys'

export function SongInfoDialog() {
  const { t } = useTranslation()
  const { songId, modalOpen, reset } = useSongInfo()

  const { data: song, isLoading } = useQuery({
    queryKey: [queryKeys.song.info, songId],
    queryFn: () => subsonic.songs.getSong(songId),
    enabled: modalOpen,
  })

  const loadedAlbumId = song ? typeof song.albumId === 'string' : false

  const { data: album, isLoading: albumLoading } = useQuery({
    queryKey: [queryKeys.album.single, song?.albumId],
    queryFn: () => subsonic.albums.getOne(song?.albumId ?? ''),
    enabled: loadedAlbumId,
  })

  function handleModalChange(value: boolean) {
    if (!value) reset()
  }

  function handleLinkClick() {
    reset()
  }

  function formatGenres() {
    if (!song) return []
    const genres: string[] = []

    if (song.genre) {
      genres.push(song.genre)
    }

    if (song.genres) {
      song.genres.forEach(({ name }) => {
        if (genres.includes(name)) return

        genres.push(name)
      })
    }

    return genres
  }

  function formatLastPlayed() {
    if (!song) return ''

    const lastPlayed = dateTime().from(dateTime(song.played), true)

    return t('table.lastPlayed', { date: lastPlayed })
  }

  return (
    <Dialog open={modalOpen} onOpenChange={handleModalChange}>
      <DialogContent
        className="max-w-[620px] p-0 gap-0 overflow-hidden"
        aria-describedby={undefined}
      >
        <DialogHeader className="border-b p-6">
          <DialogTitle>{t('songInfo.title')}</DialogTitle>
        </DialogHeader>

        {(isLoading || albumLoading) && (
          <div className="flex w-full h-32 items-center justify-center p-6">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          </div>
        )}
        {!song && !isLoading && (
          <div className="flex w-full h-32 items-center justify-center p-6">
            <p>{t('songInfo.error')}</p>
          </div>
        )}

        {song && !isLoading && (
          <ScrollArea className="p-4">
            <div className="max-h-[500px]">
              <InfoGridItem title="path">
                <code className="font-mono text-xs bg-muted border px-2 py-1 rounded flex gap-2 items-center">
                  {song.path}
                </code>
              </InfoGridItem>

              <InfoGridItem title="title">{song.title}</InfoGridItem>

              <InfoGridItem title="album">
                <Link
                  to={ROUTES.ALBUM.PAGE(song.albumId)}
                  className="text-foreground hover:underline"
                  onClick={handleLinkClick}
                >
                  {song.album}
                </Link>
              </InfoGridItem>

              {/* Multi artists info */}
              {song.albumArtists && (
                <InfoGridItem title="albumArtist">
                  {song.albumArtists.map(({ id, name }, index) => (
                    <Fragment key={id}>
                      <Link
                        to={ROUTES.ARTIST.PAGE(id)}
                        className="text-foreground hover:underline"
                        onClick={handleLinkClick}
                      >
                        {name}
                      </Link>
                      {index < song.albumArtists!.length - 1 && (
                        <Dot className="mx-0" />
                      )}
                    </Fragment>
                  ))}
                </InfoGridItem>
              )}

              {/* Multi artists info */}
              {song.artists && (
                <InfoGridItem title="artist">
                  {song.artists.map(({ id, name }, index) => (
                    <Fragment key={id}>
                      <Link
                        to={ROUTES.ARTIST.PAGE(id)}
                        className="text-foreground hover:underline"
                        onClick={handleLinkClick}
                      >
                        {name}
                      </Link>
                      {index < song.artists!.length - 1 && (
                        <Dot className="mx-0" />
                      )}
                    </Fragment>
                  ))}
                </InfoGridItem>
              )}

              {/* Single artist info */}
              {!song.artists && (
                <InfoGridItem title="artist">
                  <Link
                    to={ROUTES.ARTIST.PAGE(song.artistId ?? '')}
                    className={clsx(
                      'text-foreground',
                      song.artistId ? 'hover:underline' : 'pointer-events-none',
                    )}
                    onClick={() => {
                      if (song.artistId) handleLinkClick()
                    }}
                  >
                    {song.artist}
                  </Link>
                </InfoGridItem>
              )}

              {song.contributors && song.contributors.length > 1 && (
                <InfoGridItem title="contributors">
                  {song.contributors.map((contributor, index) => (
                    <p className="w-full" key={contributor.artist.name + index}>
                      <span className="capitalize">{contributor.role}:</span>
                      <span className="text-foreground ml-1">
                        {contributor.artist.name}
                      </span>
                    </p>
                  ))}
                </InfoGridItem>
              )}

              <InfoGridItem title="year">{song.year}</InfoGridItem>
              <InfoGridItem title="discNumber">
                {song.discNumber ?? 1}
              </InfoGridItem>
              <InfoGridItem title="track">{song.track}</InfoGridItem>

              {album && !albumLoading && (
                <>
                  {album.recordLabels && album.recordLabels.length > 0 && (
                    <InfoGridItem title="recordLabel">
                      {album.recordLabels
                        .slice(0, RECORD_LABELS_MAX_NUMBER)
                        .map((label) => (
                          <p key={label.name} className="w-full">
                            {label.name}
                          </p>
                        ))}
                    </InfoGridItem>
                  )}
                </>
              )}

              {formatGenres().length > 0 && (
                <InfoGridItem title="genres">
                  {formatGenres().map((genre) => (
                    <Link
                      to={ROUTES.ALBUMS.GENRE(genre)}
                      key={genre}
                      onClick={handleLinkClick}
                    >
                      <Badge variant="neutral">{genre}</Badge>
                    </Link>
                  ))}
                </InfoGridItem>
              )}

              <InfoGridItem title="duration">
                {convertSecondsToTime(song.duration ?? 0)}
              </InfoGridItem>
              <InfoGridItem title="size">
                {formatBytes(song.size ?? 0)}
              </InfoGridItem>
              <InfoGridItem title="bpm">{song.bpm ?? 0}</InfoGridItem>
              <InfoGridItem title="bitrate">{song.bitRate} kbps</InfoGridItem>
              <InfoGridItem title="codec">
                <Badge>{song.suffix.toUpperCase()}</Badge>
              </InfoGridItem>

              <InfoGridItem title="plays">{song.playCount ?? 0}</InfoGridItem>
              <InfoGridItem title="lastPlayed">
                {song.played ? (
                  <>{formatLastPlayed()}</>
                ) : (
                  <XIcon className="w-4 h-4 -ml-0.5 text-red-500" />
                )}
              </InfoGridItem>
              <InfoGridItem title="favorite">
                {song.starred ? (
                  <Check className="w-4 h-4 -ml-0.5 text-primary" />
                ) : (
                  <XIcon className="w-4 h-4 -ml-0.5 text-red-500" />
                )}
              </InfoGridItem>

              {song.replayGain && (
                <>
                  <InfoGridItem title="trackGain">
                    {song.replayGain.trackGain ?? 0} dB
                  </InfoGridItem>
                  <InfoGridItem title="trackPeak">
                    {song.replayGain.trackPeak ?? 1}
                  </InfoGridItem>
                  <InfoGridItem title="albumGain">
                    {song.replayGain.albumGain ?? 0} dB
                  </InfoGridItem>
                  <InfoGridItem title="albumPeak">
                    {song.replayGain.albumPeak ?? 1}
                  </InfoGridItem>
                </>
              )}

              {song.channelCount && (
                <InfoGridItem title="channelCount">
                  {song.channelCount}
                </InfoGridItem>
              )}

              {song.samplingRate && (
                <InfoGridItem title="samplingRate">
                  {song.samplingRate / 1000} Hz
                </InfoGridItem>
              )}

              <InfoGridItem title="bitDepth">{song.bitDepth ?? 0}</InfoGridItem>
            </div>
          </ScrollArea>
        )}
      </DialogContent>
    </Dialog>
  )
}

interface InfoGridItemProps {
  title: string
  children: React.ReactNode
}

function InfoGridItem({ title, children }: InfoGridItemProps) {
  const { t } = useTranslation()

  return (
    <div className="grid grid-cols-4 py-1 px-2 text-sm text-muted-foreground odd:bg-background-foreground">
      <div className="py-1 flex items-center">
        {t(`table.columns.${title}`)}
      </div>
      <div className="py-1 col-span-3 flex items-center !select-text flex-wrap gap-1">
        {children}
      </div>
    </div>
  )
}
