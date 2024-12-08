import ListWrapper from '@/app/components/list-wrapper'
import { EmptyAlbumsInfo } from './empty-message'
import { EmptyWrapper } from './empty-wrapper'
import { AlbumsHeader } from './header'

export function EmptyAlbums() {
  return (
    <div className="w-full h-content">
      <AlbumsHeader albumCount={0} />

      <ListWrapper className="pt-[--shadow-header-distance] h-full">
        <EmptyWrapper>
          <EmptyAlbumsInfo />
        </EmptyWrapper>
      </ListWrapper>
    </div>
  )
}
