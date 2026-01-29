import { EmptyPageContainer } from '@/app/components/empty-container'
import ListWrapper from '@/app/components/list-wrapper'
import { EmptyAlbumsInfo } from './empty-message'
import { EmptyWrapper } from './empty-wrapper'
import { AlbumsHeader } from './header'

export function EmptyAlbums() {
  return (
    <EmptyPageContainer>
      <AlbumsHeader albumCount={0} />

      <ListWrapper className="h-full">
        <EmptyWrapper>
          <EmptyAlbumsInfo />
        </EmptyWrapper>
      </ListWrapper>
    </EmptyPageContainer>
  )
}
