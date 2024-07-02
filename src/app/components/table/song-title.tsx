import clsx from 'clsx'
import { Link } from 'react-router-dom'
import { getCoverArtUrl } from '@/api/httpClient'
import { ROUTES } from '@/routes/routesList'
import { usePlayerActions } from '@/store/player.store'
import { ISong } from '@/types/responses/song'
import Image from '../image'

export function TableSongTitle({ song }: { song: ISong }) {
  const { checkActiveSong } = usePlayerActions()
  const songIsPlaying = checkActiveSong(song.id)

  return (
    <div className="flex gap-2 items-center min-w-[200px] max-w-[300px] 2xl:min-w-[350px] 2xl:max-w-[450px]">
      <Image
        src={getCoverArtUrl(song.coverArt, '80')}
        alt={song.title}
        width={40}
        height={40}
        className="rounded shadow-md bg-foreground/10"
      />
      <div className="flex flex-col justify-center w-full">
        <p
          className={clsx(
            'font-medium truncate',
            songIsPlaying && 'underline underline-offset-1 text-primary',
          )}
        >
          {song.title}
        </p>
        {song.artistId ? (
          <Link
            to={ROUTES.ARTIST.PAGE(song.artistId)}
            className="hover:underline flex 2xl:hidden w-fit"
          >
            <p className="text-xs text-muted-foreground">{song.artist}</p>
          </Link>
        ) : (
          <p className="flex 2xl:hidden text-xs text-muted-foreground">
            {song.artist}
          </p>
        )}
      </div>
    </div>
  )
}
