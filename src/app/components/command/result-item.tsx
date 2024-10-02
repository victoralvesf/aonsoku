import { Play } from 'lucide-react'
import { getCoverArtUrl } from '@/api/httpClient'
import Image from '@/app/components/image'
import { Button } from '@/app/components/ui/button'
import { CoverArt } from '@/types/coverArtType'

interface ResultItemProps {
  coverArt: string
  coverArtType: CoverArt
  title: string
  artist: string
  onClick: () => void
}

export function ResultItem({
  coverArt,
  coverArtType,
  title,
  artist,
  onClick,
}: ResultItemProps) {
  return (
    <div className="flex w-full justify-between items-center">
      <div className="flex gap-2 w-[420px]">
        <Image
          src={getCoverArtUrl(coverArt, coverArtType, '100')}
          width={40}
          height={40}
          className="aspect-square object-cover rounded shadow"
          alt={`${artist} - ${title}`}
        />
        <div className="flex flex-col justify-center w-full">
          <span className="font-medium text-sm truncate w-[370px]">
            {title}
          </span>
          <span className="text-xs text-muted-foreground">{artist}</span>
        </div>
      </div>
      <div className="flex">
        <Button
          variant="outline"
          size="sm"
          className="w-7 h-7 p-[6px] rounded-full hover:bg-background"
          onClick={(e) => {
            e.preventDefault()
            e.stopPropagation()
            onClick()
          }}
        >
          <Play className="w-4 h-4 fill-foreground" />
        </Button>
      </div>
    </div>
  )
}
