import { Skeleton } from "@/app/components/ui/skeleton";

export default function PreviewListFallback() {
  return (
    <div className="w-full flex flex-col mb-4">
      <div className="flex justify-between my-4">
        <Skeleton className="w-52 h-8 rounded" />
        <div className="flex gap-2">
          <Skeleton className="w-8 h-8 rounded-full" />
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
      </div>

      <div className="flex gap-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <div className="basis-1/8" key={index}>
            <Skeleton className="aspect-square" />
            <Skeleton className="h-4 w-28 mt-2" />
            <Skeleton className="h-3 w-20 mt-1" />
          </div>
        ))}
      </div>
    </div>
  )
}