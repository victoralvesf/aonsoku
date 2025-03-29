import { AlbumsFallback } from '@/app/components/fallbacks/album-fallbacks.tsx'
import { SongListFallback } from '@/app/components/fallbacks/song-fallbacks.tsx'
import { useAppArtistsViewType } from '@/store/app.store.ts'

export function ArtistsFallback() {
  const { isTableView } = useAppArtistsViewType()

  if (isTableView) return <SongListFallback />

  return <AlbumsFallback />
}
