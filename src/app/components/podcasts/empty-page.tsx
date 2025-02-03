import { Podcast } from 'lucide-react'
import { EmptyWrapper } from '@/app/components/albums/empty-wrapper'
import ListWrapper from '@/app/components/list-wrapper'
import { Button } from '@/app/components/ui/button'
import { PodcastsHeader } from './header'

export function EmptyPodcastsPage() {
  return (
    <div className="w-full h-content">
      <PodcastsHeader />

      <ListWrapper className="pt-[--shadow-header-distance] h-full">
        <EmptyWrapper>
          <div className="text-center max-w-[500px]">
            <div className="flex w-full justify-center items-center mb-2">
              <Podcast className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-semibold tracking-tight">
              No podcasts added
            </h3>
            <p className="text-sm text-muted-foreground">
              It looks like you have not added any podcasts yet. Add one below!
            </p>

            <Button
              size="sm"
              variant="default"
              className="mt-4"
              onClick={() => {}}
            >
              <span>Add Podcast</span>
            </Button>
          </div>
        </EmptyWrapper>
      </ListWrapper>
    </div>
  )
}
