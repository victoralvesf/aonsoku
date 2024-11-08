import { TableFallback } from '@/app/components/fallbacks/table-fallbacks'
import { ShadowHeaderFallback } from '@/app/components/fallbacks/ui-fallbacks'
import ListWrapper from '@/app/components/list-wrapper'
import { Skeleton } from '@/app/components/ui/skeleton'

export function SongListFallback() {
  return (
    <div className="w-full h-full">
      <ShadowHeaderFallback />

      <ListWrapper>
        <div className="max-w-xs h-10 mb-4 mt-6 bg-background border rounded flex items-center px-3">
          <Skeleton className="w-16 h-4" />
        </div>

        <TableFallback />
      </ListWrapper>
    </div>
  )
}

export function InfinitySongListFallback() {
  return (
    <div className="w-full h-full">
      <ShadowHeaderFallback />

      <TableFallback variant="modern" length={20} type="infinity" />
    </div>
  )
}
