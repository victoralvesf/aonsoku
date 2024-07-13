import { Skeleton } from '@/app/components/ui/skeleton'

export function TableFallback() {
  return (
    <div className="w-full border rounded-md">
      <div className="grid grid-cols-table-fallback py-4 px-2 items-center">
        <Skeleton className="w-5 h-5 rounded ml-2" />
        <Skeleton className="w-8 h-5 rounded" />
        <Skeleton className="w-16 h-5 rounded" />
        <Skeleton className="w-16 h-5 rounded" />
        <Skeleton className="w-12 h-5 rounded" />
        <Skeleton className="w-16 h-5 rounded" />
        <Skeleton className="w-12 h-5 rounded" />
      </div>
      {Array.from({ length: 10 }).map((_, index) => (
        <div
          key={index}
          className="grid grid-cols-table-fallback p-2 items-center border-t"
        >
          <Skeleton className="w-5 h-5 rounded ml-2" />
          <div className="flex items-center gap-2">
            <Skeleton className="w-10 h-10 rounded" />
            <Skeleton className="w-36 h-5 rounded" />
          </div>
          <Skeleton className="w-36 h-5 rounded" />
          <Skeleton className="w-12 h-5 rounded" />
          <Skeleton className="w-6 h-5 rounded" />
          <Skeleton className="w-20 h-5 rounded" />
          <Skeleton className="w-14 h-5 rounded-full" />
        </div>
      ))}
    </div>
  )
}

export function TopSongsTableFallback() {
  return (
    <div className="w-full">
      <Skeleton className="w-28 h-8 mb-4 mt-6 rounded" />

      <TableFallback />
    </div>
  )
}
