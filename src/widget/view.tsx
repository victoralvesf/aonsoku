import { cn } from '@/lib/utils'
import { WidgetNowPlayingPayload, WidgetProfile } from '@/types/widget'
import { CoverArt } from './cover-art'
import { ProgressBar } from './progress-bar'
import { getWidgetThemeStyle } from './themes'

const TRANSITION_STYLES = `
@keyframes aonsoku-widget-enter {
  from { opacity: 0; transform: translateY(6px); }
  to { opacity: 1; transform: translateY(0); }
}
.aonsoku-widget-enter { animation: aonsoku-widget-enter 320ms ease-out both; }
`

export interface WidgetViewProps {
  profile: WidgetProfile
  nowPlaying: WidgetNowPlayingPayload | null
  position?: number
  className?: string
}

export function WidgetView({
  profile,
  nowPlaying,
  position,
  className,
}: WidgetViewProps) {
  const { compact, theme, idleBehavior, transitionOnChange, showCoverArt } =
    profile

  const isIdle = !nowPlaying || !nowPlaying.isPlaying

  if (isIdle && idleBehavior === 'hide') return null

  const coverSize = compact ? 48 : 88
  const themeStyle = getWidgetThemeStyle(theme)

  const container = cn(
    'flex w-full items-center overflow-hidden',
    compact
      ? 'gap-2.5 p-2.5 pr-4 rounded-[calc(0.625rem+8px)]'
      : 'gap-3 p-3 pr-4 rounded-[calc(0.75rem+8px)]',
    !showCoverArt && 'pl-4',
    className,
  )

  const containerStyle = {
    ...themeStyle,
    background: 'var(--w-bg)',
    boxShadow: 'var(--w-shadow)',
    color: 'var(--w-fg)',
  }

  if (isIdle) {
    return (
      <div className={container} style={containerStyle}>
        <style>{TRANSITION_STYLES}</style>
        <span
          className={cn('truncate', compact ? 'text-[13px]' : 'text-sm')}
          style={{
            color: 'var(--w-muted)',
            textShadow: 'var(--w-text-shadow)',
          }}
        >
          Nothing playing
        </span>
      </div>
    )
  }

  const { title, artist, album, coverArtUrl, duration } = nowPlaying
  const currentPosition = position ?? nowPlaying.position

  return (
    <div className={container} style={containerStyle}>
      <style>{TRANSITION_STYLES}</style>

      {profile.showCoverArt && <CoverArt url={coverArtUrl} size={coverSize} />}

      <div
        // Remounting on track change is what replays the enter animation.
        key={transitionOnChange ? `${title}::${artist}` : undefined}
        className={cn(
          'flex min-w-0 flex-1 flex-col justify-center',
          transitionOnChange && 'aonsoku-widget-enter',
        )}
      >
        <span
          className={cn(
            'truncate font-medium leading-tight',
            compact ? 'text-sm' : 'text-base',
          )}
          style={{ textShadow: 'var(--w-text-shadow)' }}
        >
          {title}
        </span>

        <div
          className={cn(
            'flex items-center gap-1',
            compact ? 'text-xs' : 'text-sm',
          )}
          style={{
            color: 'var(--w-muted)',
            textShadow: 'var(--w-text-shadow)',
          }}
        >
          {profile.showArtist && (
            <span className="truncate leading-tight">{artist}</span>
          )}

          {profile.showArtist && profile.showAlbum && (
            <span className="h-2 flex items-center">•</span>
          )}

          {profile.showAlbum && album && (
            <span className="truncate leading-tight">{album}</span>
          )}
        </div>

        {profile.showProgressBar && (
          <ProgressBar
            position={currentPosition}
            duration={duration}
            compact={compact}
          />
        )}
      </div>
    </div>
  )
}
