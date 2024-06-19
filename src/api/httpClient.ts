import { FetchOptions, fetch as tauriFetch } from '@tauri-apps/api/http'
import { getFromLocalStorage } from '@/utils/persistDataLayer'
import { SubsonicJsonResponse } from '@/types/responses/subsonicResponse'
import { isTauri } from '@/utils/tauriTools'

function queryParams() {
  const { username, token, salt } = getFromLocalStorage()
  return {
    u: username ?? '',
    t: token ?? '',
    s: salt ?? '',
    v: '1.16.0',
    c: 'Subsonic-Player',
    f: 'json',
  }
}

async function browserFetch<T>(
  url: string,
  options: RequestInit,
): Promise<{ count: number; data: T } | undefined> {
  try {
    const response = await fetch(url, options)

    if (response.ok) {
      const data = await response.json()
      return {
        count: parseInt(response.headers.get('x-total-count') || '0', 10),
        data: data['subsonic-response'] as T,
      }
    }
  } catch (error) {
    console.error('Error on browserFetch request', error)
    return undefined
  }
}

async function rustFetch<T>(
  url: string,
  options: FetchOptions,
): Promise<{ count: number; data: T } | undefined> {
  try {
    const response = await tauriFetch(url, {
      ...options,
      query: {
        ...options.query,
        ...queryParams(),
      },
      body: options.body || undefined,
    })

    if (response.ok) {
      const data = response.data as SubsonicJsonResponse

      return {
        count: parseInt(response.headers['x-total-count'] || '0', 10),
        data: data['subsonic-response'] as T,
      }
    }
  } catch (error) {
    console.error('Error on tauriFetch request', error)
    return undefined
  }
}

export async function httpClient<T>(
  path: string,
  options: FetchOptions,
): Promise<{ count: number; data: T } | undefined> {
  try {
    const { url } = getFromLocalStorage()
    let fullUrl = `${url}/rest${path}`

    if (isTauri()) {
      return await rustFetch(fullUrl, { ...options })
    } else {
      const queries = new URLSearchParams({
        ...options.query,
        ...queryParams(),
      }).toString()

      fullUrl += path.includes('?') ? `&${queries}` : `?${queries}`

      return await browserFetch<T>(fullUrl, {
        method: options.method,
        headers: options.headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
      })
    }
  } catch (error) {
    console.error('Error on httpClient request', error)
    return undefined
  }
}

export function getCoverArtUrl(id: string, size = '300') {
  const { url } = getFromLocalStorage()
  const baseUrl = `${url}/rest/getCoverArt`

  const params = {
    ...queryParams(),
    id,
    size,
  }

  const queryString = new URLSearchParams(params).toString()
  const fullUrl = `${baseUrl}?${queryString}`

  return fullUrl
}

export function getSongStreamUrl(id: string) {
  const { url } = getFromLocalStorage()
  const baseUrl = `${url}/rest/stream`

  const params = {
    ...queryParams(),
    id,
    maxBitRate: '0',
    format: 'raw',
    estimateContentLength: 'true',
  }

  const queryString = new URLSearchParams(params).toString()
  const fullUrl = `${baseUrl}?${queryString}`

  return fullUrl
}
