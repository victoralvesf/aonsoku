import ListWrapper from '@/app/components/list-wrapper'
import { EmptyAlbumsInfo } from './empty-message'
import { AlbumsHeader } from './header'

export function EmptyAlbums() {
  return (
    <div className="w-full h-app-screen">
      <AlbumsHeader albumCount={0} />

      <ListWrapper className="pt-[--shadow-header-distance] h-full">
        <div className="h-full flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
          <EmptyAlbumsInfo />
        </div>
      </ListWrapper>
    </div>
  )
}
