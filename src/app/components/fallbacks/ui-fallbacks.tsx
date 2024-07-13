import { Skeleton } from '@/app/components/ui/skeleton'

export function ShadowHeaderFallback() {
  return (
    <div className="flex items-center justify-start px-8 h-[--shadow-header-height] border-b shadow-lg shadow-b-2 -shadow-spread-2">
      <Skeleton className="w-28 h-8" />
      <Skeleton className="w-11 h-[22px] ml-2 rounded-full" />
    </div>
  )
}
