/* eslint-disable react-hooks/rules-of-hooks */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { ColumnDef } from '@tanstack/react-table'
import { Heart } from 'lucide-react'
import clsx from 'clsx'

import i18n from '@/i18n'
import { ISimilarArtist } from '@/types/responses/artist'
import { ROUTES } from '@/routes/routesList'
import { getCoverArtUrl } from '@/api/httpClient'
import { Button } from '@/app/components/ui/button'
import { subsonic } from '@/service/subsonic'
import PlaySongButton from '@/app/components/table/play-button'

export function artistsColumns(): ColumnDef<ISimilarArtist>[] {
  return [
    {
      id: 'index',
      accessorKey: 'index',
      header: () => {
        return <div className="text-center">#</div>
      },
      cell: ({ row, table }) => {
        const index = row.index + 1
        const artist = row.original

        return (
          <PlaySongButton
            type="artist"
            trackNumber={index}
            trackId={artist.id}
            title={artist.name}
            handlePlayButton={() => table.options.meta?.handlePlaySong?.(row)}
          />
        )
      },
    },
    {
      id: 'name',
      accessorKey: 'name',
      header: i18n.t('table.columns.name'),
      cell: ({ row }) => (
        <div className="flex gap-2 items-center min-w-[200px] 2xl:min-w-[350px]">
          <div
            className="w-[40px] h-[40px] min-w-[40px] min-h-[40px] aspect-square bg-cover bg-center rounded shadow-md bg-foreground/10"
            style={{
              backgroundImage: `url(${getCoverArtUrl(row.original.coverArt, '80')})`,
            }}
          />
          <div className="flex flex-col justify-center items-center">
            <Link
              to={ROUTES.ARTIST.PAGE(row.original.id)}
              className="hover:underline flex w-fit"
            >
              <p>{row.original.name}</p>
            </Link>
          </div>
        </div>
      ),
    },
    {
      id: 'albumCount',
      accessorKey: 'albumCount',
      header: i18n.t('table.columns.albumCount'),
    },
    {
      id: 'starred',
      accessorKey: 'starred',
      header: '',
      size: 40,
      maxSize: 40,
      cell: ({ row }) => {
        const { starred, id } = row.original
        const [isStarredLocal, setIsStarredLocal] = useState(
          typeof starred === 'string',
        )

        async function handleStarred() {
          const state = !isStarredLocal

          await subsonic.star.handleStarItem(id, isStarredLocal)
          setIsStarredLocal(state)
        }

        return (
          <Button
            variant="ghost"
            className="rounded-full w-8 h-8 p-1 hover:border hover:bg-white dark:hover:bg-slate-950 hover:shadow-sm"
            onClick={handleStarred}
          >
            <Heart
              className={clsx(
                'w-4 h-4',
                isStarredLocal && 'text-red-500 fill-red-500',
              )}
              strokeWidth={2}
            />
          </Button>
        )
      },
    },
  ]
}