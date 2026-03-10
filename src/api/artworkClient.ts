import { useAppStore } from '@/store/app.store'

export const defaultArtworkServiceUrl = 'https://artwork.m8tec.top'
const artworkSearchPath = '/api/v1/artwork/search'

function getArtworkSearchUrl() {
  const { customUrlEnabled, baseUrl: configuredBaseUrl } =
    useAppStore.getState().artwork
  const baseUrl = customUrlEnabled
    ? configuredBaseUrl || defaultArtworkServiceUrl
    : defaultArtworkServiceUrl

  try {
    return new URL(artworkSearchPath, baseUrl).toString()
  } catch {
    return new URL(artworkSearchPath, defaultArtworkServiceUrl).toString()
  }
}

function getUrlFromPayload(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    return null
  }

  const url = (payload as { url?: unknown }).url
  return typeof url === 'string' && url.includes('.m3u8') ? url : null
}

export async function getAnimatedArtworkUrl(
  artist: string,
  album: string,
): Promise<string | null> {
  try {
    const query = new URLSearchParams({ artist, album })
    const searchUrl = getArtworkSearchUrl()
    const response = await fetch(`${searchUrl}?${query.toString()}`)

    if (!response.ok) {
      return null
    }

    const payload = (await response.json()) as unknown
    return getUrlFromPayload(payload)
  } catch (error) {
    console.warn('Unable to fetch animated artwork URL:', error)
    return null
  }
}
