import { PlayButtonsFallback } from '@/app/components/fallbacks/album-fallbacks'
import { TableFallback } from '@/app/components/fallbacks/table-fallbacks'
import { Skeleton } from '@/app/components/ui/skeleton'

export function PlaylistHeaderFallback() {
  return (
    <div className="flex items-end">
      <Skeleton className="w-[200px] h-[200px] 2xl:w-[250px] 2xl:h-[250px] rounded-lg shadow-md" />
      <div className="flex flex-col h-full justify-end ml-4">
        <Skeleton className="w-12 h-5 mb-2" />
        <Skeleton className="w-[440px] h-10 mt-1 2xl:h-14" />
        <Skeleton className="w-32 h-5 mt-4" />
        <div className="flex gap-1 mt-3">
          <Skeleton className="w-24 h-[22px] rounded-full" />
          <Skeleton className="w-24 h-[22px] rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function PlaylistFallback() {
  return (
    <div className="w-full px-8 py-6">
      <PlaylistHeaderFallback />
      <PlayButtonsFallback />
      <TableFallback />
    </div>
  )
}
