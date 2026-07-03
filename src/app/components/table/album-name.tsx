import { ComponentPropsWithoutRef } from 'react'
import { Link } from 'react-router-dom'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'
import { cn } from '@/lib/utils'
import { ROUTES } from '@/routes/routesList'
import { ISong } from '@/types/responses/song'

type TableAlbumNameProps = Omit<ComponentPropsWithoutRef<typeof Link>, 'to'> & {
  song: ISong
}

export function TableAlbumName({
  song,
  className,
  onContextMenu,
  ...props
}: TableAlbumNameProps) {
  return (
    <SimpleTooltip text={song.album} delay={1000}>
      <Link
        to={ROUTES.ALBUM.PAGE(song.albumId)}
        className={cn(
          'hover:underline truncate text-foreground/70 hover:text-foreground',
          className,
        )}
        onContextMenu={(e) => {
          e.stopPropagation()
          e.preventDefault()
          onContextMenu?.(e)
        }}
        {...props}
      >
        {song.album}
      </Link>
    </SimpleTooltip>
  )
}
