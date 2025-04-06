import { useTranslation } from 'react-i18next'
import { Button } from '@/app/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu'
import { usePlayerActions, usePlayerStore } from '@/store/player.store'

const rates = [
  { label: '0.25x', value: 0.25 },
  { label: '0.5x', value: 0.5 },
  { label: '0.75x', value: 0.75 },
  { label: '1.0x', value: 1.0 },
  { label: '1.25x', value: 1.25 },
  { label: '1.5x', value: 1.5 },
  { label: '1.75x', value: 1.75 },
  { label: '2.0x', value: 2.0 },
]

export function PodcastPlaybackRate() {
  const { t } = useTranslation()
  const currentPlaybackRate = usePlayerStore(
    (state) => state.playerState.currentPlaybackRate,
  )
  const { setPlaybackRate } = usePlayerActions()

  const currentRate = rates.find((rate) => rate.value === currentPlaybackRate)
  const currentRateLabel = currentRate?.label ?? ''

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className="focus-visible:ring-transparent data-[state=open]:bg-accent p-2"
        >
          <span className="text-foreground text-sm font-normal">
            {currentRateLabel}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {rates.map(({ label, value }) => (
          <DropdownMenuCheckboxItem
            key={value}
            checked={value === currentPlaybackRate}
            onCheckedChange={() => setPlaybackRate(value)}
          >
            {label}
          </DropdownMenuCheckboxItem>
        ))}
        {currentPlaybackRate !== 1 && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setPlaybackRate(1)}>
              {t('table.sort.reset')}
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
