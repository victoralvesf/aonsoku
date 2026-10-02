import { cn } from '@/lib/utils'

function pad(num: number) {
  return num.toString().padStart(2, '0')
}

function formatTime(seconds: number) {
  const safe = Number.isFinite(seconds) && seconds > 0 ? Math.floor(seconds) : 0
  const minutes = Math.floor((safe % 3600) / 60)
  const rest = safe % 60

  return `${pad(minutes)}:${pad(rest)}`
}

interface ProgressBarProps {
  position: number
  duration: number
  compact: boolean
}

export function ProgressBar({ position, duration, compact }: ProgressBarProps) {
  const ratio = duration > 0 ? Math.min(Math.max(position / duration, 0), 1) : 0

  return (
    <div className={cn('flex items-center gap-2', compact ? 'mt-1.5' : 'mt-2')}>
      {!compact && (
        <span
          className="font-mono shrink-0 text-[11px] tabular-nums"
          style={{
            color: 'var(--w-muted)',
            textShadow: 'var(--w-text-shadow)',
          }}
        >
          {formatTime(position)}
        </span>
      )}
      <div
        className={cn(
          'flex-1 overflow-hidden rounded-full',
          compact ? 'h-1' : 'h-1.5',
        )}
        style={{ background: 'var(--w-track)' }}
      >
        <div
          className="h-full rounded-full"
          style={{
            width: `${ratio * 100}%`,
            background: 'var(--w-accent)',
            transition: 'width 250ms linear',
          }}
        />
      </div>
      {!compact && (
        <span
          className="font-mono shrink-0 text-[11px] tabular-nums"
          style={{
            color: 'var(--w-muted)',
            textShadow: 'var(--w-text-shadow)',
          }}
        >
          {formatTime(duration)}
        </span>
      )}
    </div>
  )
}
