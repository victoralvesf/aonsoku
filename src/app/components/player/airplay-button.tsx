import { AirplayIcon } from 'lucide-react'
import { Button } from '@/app/components/ui/button'
import { SimpleTooltip } from '@/app/components/ui/simple-tooltip'

interface AirPlayButtonProps {
  disabled?: boolean
}

export function AirPlayButton({ disabled }: AirPlayButtonProps) {
  function handleClick(event: React.MouseEvent<HTMLButtonElement>) {
    const rect = event.currentTarget.getBoundingClientRect()
    window.api.avPlayer.command({
      type: 'showAirPlay',
      x: rect.left + rect.width / 2 + window.screenX,
      y: rect.top + window.screenY,
      height: rect.height,
    })
  }

  return (
    <SimpleTooltip text="AirPlay">
      <Button
        variant="ghost"
        size="icon"
        className="rounded-full w-10 h-10 p-2 text-secondary-foreground"
        onClick={handleClick}
        disabled={disabled}
      >
        <AirplayIcon className="w-4 h-4" />
      </Button>
    </SimpleTooltip>
  )
}
