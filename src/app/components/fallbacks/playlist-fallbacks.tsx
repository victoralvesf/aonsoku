import { ImageHeaderEffect } from '@/app/components/album/header-effect'
import {
  AlbumHeaderFallback,
  PlayButtonsFallback,
} from '@/app/components/fallbacks/album-fallbacks'
import { TableFallback } from '@/app/components/fallbacks/table-fallbacks'
import ListWrapper from '@/app/components/list-wrapper'

export function PlaylistFallback() {
  return (
    <div className="w-full">
      <div className="relative">
        <AlbumHeaderFallback />
        <ImageHeaderEffect className="bg-muted-foreground" />
      </div>

      <ListWrapper>
        <PlayButtonsFallback />
        <TableFallback variant="modern" />
      </ListWrapper>
    </div>
  )
}
