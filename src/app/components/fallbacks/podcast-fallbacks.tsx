import clsx from 'clsx'
import ListWrapper from '@/app/components/list-wrapper'
import { Separator } from '@/app/components/ui/separator'
import { Skeleton } from '@/app/components/ui/skeleton'
import { ShadowHeaderFallback } from './ui-fallbacks'

export function PodcastFallback() {
  return (
    <div className="w-full">
      <PodcastHeaderFallback />
      <EpisodeListFallback />
    </div>
  )
}

export function FeaturedEpisodeCardFallback() {
  return (
    <div className="bg-background border rounded-lg flex flex-col p-4">
      <Skeleton className="w-full aspect-square rounded-md" />
      <div className="mt-2">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-5 w-full mt-2" />
        <Skeleton className="h-4 w-[90%] mt-2 rounded-b-none" />
        <Skeleton className="h-4 w-[95%] rounded-tl-none" />
        <div className="mt-4 flex justify-between">
          <Skeleton className="h-8 w-24" />
          <Skeleton className="w-8 h-8 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function LatestEpisodesFallback() {
  return (
    <div className="w-full">
      <ShadowHeaderFallback />
      <ListWrapper className="px-4 pt-6">
        <div className="grid grid-cols-5 gap-4 px-4 mb-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <FeaturedEpisodeCardFallback key={index} />
          ))}
        </div>

        {Array.from({ length: 12 }).map((_, index) => (
          <EpisodeCardFallback key={'episode-fb-' + index} />
        ))}
      </ListWrapper>
    </div>
  )
}

export function EpisodeListFallback() {
  return (
    <div>
      <PodcastFiltersFallback />

      <ListWrapper className="px-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <EpisodeCardFallback key={'episode-fb-' + index} />
        ))}
      </ListWrapper>
    </div>
  )
}

export function EpisodeFallback() {
  return (
    <div className="w-full">
      <PodcastHeaderFallback podcast={false} />
      <ListWrapper>
        <div className="mb-6 flex gap-1 items-center">
          <Skeleton className="rounded-full w-14 h-14 mr-2" />
        </div>
        <div className="w-full">
          <Skeleton className="h-4 w-full my-3" />
          <Skeleton className="h-4 w-11/12 my-3" />
          <Skeleton className="h-4 w-full my-3" />
          <Skeleton className="h-4 w-full my-3" />
          <Skeleton className="h-4 w-11/12 my-3" />
          <Skeleton className="h-4 w-full my-3" />
          <Skeleton className="h-4 w-full my-3" />
          <Skeleton className="h-4 w-11/12 my-3" />
          <Skeleton className="h-4 w-5/6 my-3" />
        </div>
      </ListWrapper>
    </div>
  )
}

interface PodcastHeaderProps {
  podcast?: boolean
}

export function PodcastHeaderFallback({ podcast = true }: PodcastHeaderProps) {
  return (
    <div className="w-full px-8 py-6 flex gap-4">
      <Skeleton className="rounded w-[200px] h-[200px] min-w-[200px] min-h-[200px] 2xl:w-[250px] 2xl:h-[250px] 2xl:min-w-[250px] 2xl:min-h-[250px] aspect-square" />
      <div className="flex flex-col justify-end w-full">
        <Skeleton className="h-12 w-3/5 mb-3" />
        <Skeleton className="h-6 w-2/6 mb-3" />
        <Separator className={clsx(!podcast && 'mb-3')} />
        {podcast && <Skeleton className="h-4 w-5/6 my-3" />}

        <div className="flex gap-2 items-center">
          <Skeleton className="h-4 w-20 rounded-full" />
          <Skeleton className="h-1 w-1 rounded-full" />
          <Skeleton className="h-4 w-20 rounded-full" />
          <Skeleton className="h-1 w-1 rounded-full" />
          <Skeleton className="h-4 w-20 rounded-full" />
        </div>
      </div>
    </div>
  )
}

export function PodcastFiltersFallback() {
  return (
    <div className="px-8 h-16 flex items-center justify-between">
      <Skeleton className="h-7 w-28" />

      <div className="flex gap-2">
        <Skeleton className="h-9 w-[42px]" />
        <Skeleton className="h-9 w-[42px]" />
      </div>
    </div>
  )
}

export function EpisodeCardFallback() {
  return (
    <div className="flex gap-2 items-center px-4 py-3 rounded-lg max-w-full">
      <Skeleton className="rounded w-[100px] aspect-square" />
      <div className="flex flex-col flex-1 space-y-2 min-w-64">
        <Skeleton className="h-3 w-20" />
        <Skeleton className="h-4 w-64" />
        <Skeleton className="h-8 w-full" />
      </div>
      <div className="min-w-[14%] flex items-center justify-center">
        <Skeleton className="h-3 w-20" />
      </div>
      <div className="min-w-16 flex items-center justify-end">
        <Skeleton className="h-6 w-4 mr-3" />
      </div>
    </div>
  )
}
