import { useAppStore } from '@/store/app.store'

export function checkServerType() {
  const { serverType } = useAppStore.getState().data

  const isSubsonic = serverType === 'subsonic'
  const isNavidrome = serverType === 'navidrome'
  const isLms = serverType === 'lms'

  return {
    isSubsonic,
    isNavidrome,
    isLms,
  }
}

export function getServerExtensions() {
  const { extensionsSupported } = useAppStore.getState().data

  const songLyricsEnabled =
    extensionsSupported &&
    extensionsSupported.songLyrics &&
    extensionsSupported.songLyrics.length > 0

  return {
    songLyricsEnabled,
  }
}
