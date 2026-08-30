import { createRoot } from 'react-dom/client'
import { WidgetProfile, WidgetTheme } from '@/types/widget'
import './widget.css'
import { useInterpolatedPosition, useNowPlaying } from './use-now-playing'
import { WidgetView } from './view'

declare global {
  interface Window {
    __WIDGET_PROFILE__?: WidgetProfile
  }
}

// The server injects the profile into the HTML shell, so the page never needs
// a config round-trip. The fallback only matters when the page is opened
// straight from the dev server instead of through the widget server.
const fallbackProfile: WidgetProfile = {
  id: 'preview',
  name: 'Preview',
  theme: (new URLSearchParams(window.location.search).get('theme') ??
    'dark') as WidgetTheme,
  compact: false,
  showCoverArt: true,
  showArtist: true,
  showAlbum: true,
  showProgressBar: true,
  idleBehavior: 'show-empty-state',
  transitionOnChange: true,
}

const profile = window.__WIDGET_PROFILE__ ?? fallbackProfile

document.title = `Aonsoku Widget · ${profile.name}`

function Widget() {
  const nowPlaying = useNowPlaying()
  const position = useInterpolatedPosition(nowPlaying)

  return (
    <div className="flex h-full w-full items-center p-4">
      <WidgetView
        profile={profile}
        nowPlaying={nowPlaying}
        position={position}
      />
    </div>
  )
}

createRoot(document.getElementById('widget-root') as HTMLElement).render(
  <Widget />,
)
