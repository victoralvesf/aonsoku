import { Skeleton } from '@/app/components/ui/skeleton'

export function HeaderFallback() {
  return <Skeleton className="w-full rounded-lg h-[200px] 2xl:h-[300px]" />
}

export function HomeFallback() {
  return (
    <div className="w-full px-8 py-6">
      <HeaderFallback />

      <PreviewListFallback />
      <PreviewListFallback />
      <PreviewListFallback />
      <PreviewListFallback />
    </div>
  )
}

export function PreviewListFallback() {
  return (
    <div className="w-full flex flex-col my-4">
      <div className="flex justify-between my-4">
        <Skeleton className="w-52 h-8 rounded" />
        <div className="flex gap-2">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
      </div>

      <div className="hidden 2xl:flex gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div className="basis-1/8" key={'large-' + index}>
            <Skeleton className="aspect-square" />
            <Skeleton className="h-4 w-28 mt-2" />
            <Skeleton className="h-3 w-20 mt-1" />
          </div>
        ))}
      </div>

      <div className="flex 2xl:hidden gap-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <div className="basis-1/5" key={'small-' + index}>
            <Skeleton className="aspect-square" />
            <Skeleton className="h-4 w-28 mt-2" />
            <Skeleton className="h-3 w-20 mt-1" />
          </div>
        ))}
      </div>
    </div>
  )
}
