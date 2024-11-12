import { Fragment } from 'react/jsx-runtime'
import { CollapsibleInfo } from '@/app/components/info/collapsible-info'
import { useGetAlbumInfo } from '@/app/hooks/use-album'
import { SingleAlbum } from '@/types/responses/album'
import { AlbumButtons } from './buttons'

interface AlbumInfoProps {
  album: SingleAlbum
}

export function AlbumInfo({ album }: AlbumInfoProps) {
  const { data: albumInfo } = useGetAlbumInfo(album.id)

  const hasInfoToShow = albumInfo !== undefined && albumInfo.notes !== undefined

  return (
    <Fragment>
      <AlbumButtons album={album} showInfoButton={hasInfoToShow} />

      {hasInfoToShow && (
        <CollapsibleInfo
          title={album.name}
          bio={albumInfo.notes}
          lastFmUrl={albumInfo.lastFmUrl}
        />
      )}
    </Fragment>
  )
}
