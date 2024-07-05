import { ListVideo } from 'lucide-react'
import { Button } from '@/app/components/ui/button'

interface PlayerSongListButtonProps {
  disabled: boolean
}

export function PlayerSongListButton({ disabled }: PlayerSongListButtonProps) {
  return (
    <Button
      variant="ghost"
      className="rounded-full w-10 h-10 p-2"
      disabled={disabled}
    >
      <ListVideo className="w-4 h-4" />
    </Button>
  )
}
