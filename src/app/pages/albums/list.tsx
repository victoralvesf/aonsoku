import { AlbumGridCard } from '@/app/components/albums/album-grid-card'
import { EmptyAlbums } from '@/app/components/albums/empty-page'
import { AlbumsHeader } from '@/app/components/albums/header'
import { AlbumsFallback } from '@/app/components/fallbacks/album-fallbacks'
import { GridViewWrapper } from '@/app/components/grid-view-wrapper'
import ListWrapper from '@/app/components/list-wrapper'
import { useAlbumsListModel } from './list.model'

export default function AlbumsList() {
  const { isLoading, isEmpty, albums, albumsCount } = useAlbumsListModel()

  if (isLoading) return <AlbumsFallback />
  if (isEmpty) return <EmptyAlbums />

  return (
    <div className="w-full h-full">
      <AlbumsHeader albumCount={albumsCount} />

      <ListWrapper className="pt-[--shadow-header-distance] px-0">
        <GridViewWrapper list={albums} data-testid="albums-grid" type="albums">
          {(album) => <AlbumGridCard album={album} />}
        </GridViewWrapper>
      </ListWrapper>
    </div>
  )
}
