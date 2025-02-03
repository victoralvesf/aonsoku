import { PlusIcon } from 'lucide-react'
import { ShadowHeader } from '@/app/components/album/shadow-header'
import { HeaderTitle } from '@/app/components/header-title'
import { Button } from '@/app/components/ui/button'

export function PodcastsHeader() {
  return (
    <ShadowHeader>
      <div className="w-full flex justify-between">
        <HeaderTitle title="Podcasts" />

        <div>
          <Button
            size="sm"
            variant="default"
            className="px-4"
            onClick={() => {}}
          >
            <PlusIcon className="w-5 h-5 -ml-[3px]" />
            <span className="ml-2">Add Podcast</span>
          </Button>
        </div>
      </div>
    </ShadowHeader>
  )
}
