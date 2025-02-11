import { Button } from '@/app/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu'

export function PodcastPlaybackRate() {
  const rates = [
    { id: 1, label: '0.25x' },
    { id: 2, label: '0.50x' },
    { id: 3, label: '0.75x' },
    { id: 4, label: '1.00x' },
    { id: 5, label: '1.25x' },
    { id: 6, label: '1.50x' },
    { id: 7, label: '1.75x' },
    { id: 8, label: '2.00x' },
  ]

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="focus-visible:ring-transparent data-[state=open]:bg-accent p-2"
        >
          <span className="text-foreground text-sm font-normal">2.00x</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {rates.map(({ id, label }) => (
          <DropdownMenuCheckboxItem
            key={id}
            checked={id === 4}
            onCheckedChange={() => {}}
          >
            {label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
