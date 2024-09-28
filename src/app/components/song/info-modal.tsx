import { useQuery } from '@tanstack/react-query'
import { Check, Loader2, XIcon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
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
import { queryKeys } from '@/utils/queryKeys'

export function SongInfoModal() {
  const { t } = useTranslation()
  const { songId, modalOpen, reset } = useSongInfo()

  const { data: song, isLoading } = useQuery({
    queryKey: [queryKeys.song.info, songId],
    queryFn: () => subsonic.songs.getSong(songId),
    enabled: modalOpen,
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
      <DialogContent className="max-w-[620px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="border-b p-6">
          <DialogTitle>{t('songInfo.title')}</DialogTitle>
        </DialogHeader>

        {isLoading && (
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

              <InfoGridItem title="artist">
                {song.artistId ? (
                  <Link
                    to={ROUTES.ARTIST.PAGE(song.artistId)}
                    className="text-foreground hover:underline"
                    onClick={handleLinkClick}
                  >
                    {song.artist}
                  </Link>
                ) : (
                  <>{song.artist}</>
                )}
              </InfoGridItem>

              <InfoGridItem title="year">{song.year}</InfoGridItem>
              <InfoGridItem title="discNumber">
                {song.discNumber ?? 1}
              </InfoGridItem>
              <InfoGridItem title="track">{song.track}</InfoGridItem>

              {formatGenres().length > 0 && (
                <InfoGridItem title="genres">
                  {formatGenres().map((genre) => (
                    <Link
                      to={ROUTES.ALBUMS.GENRE(genre)}
                      key={genre}
                      className="mr-2"
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
                    {song.replayGain.trackPeak ?? 0}
                  </InfoGridItem>
                  <InfoGridItem title="albumPeak">
                    {song.replayGain.albumPeak ?? 0}
                  </InfoGridItem>
                </>
              )}
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
    <div className="grid grid-cols-4 py-1 px-2 text-sm text-muted-foreground odd:bg-[--main-background]">
      <div className="py-1 flex items-center">
        {t(`table.columns.${title}`)}
      </div>
      <div className="py-1 col-span-3 flex items-center !select-text">
        {children}
      </div>
    </div>
  )
}
