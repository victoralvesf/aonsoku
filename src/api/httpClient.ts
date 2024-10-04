import { FetchOptions, fetch as tauriFetch } from '@tauri-apps/api/http'
import omit from 'lodash/omit'
import { useAppStore } from '@/store/app.store'
import { CoverArt } from '@/types/coverArtType'
import { SubsonicJsonResponse } from '@/types/responses/subsonicResponse'
import { AuthType } from '@/types/serverConfig'
import { appName } from '@/utils/appName'
import { saltWord } from '@/utils/salt'
import { isTauri } from '@/utils/tauriTools'

type AuthParams = { u: string; t: string; s: string } | { u: string; p: string }

export function authQueryParams(
  username: string,
  password: string,
  authType: AuthType | null,
): AuthParams {
  if (authType === AuthType.TOKEN) {
    return {
      u: username ?? '',
      t: password ?? '',
      s: saltWord,
    }
  } else if (authType === AuthType.PASSWORD) {
    return {
      u: username ?? '',
      p: password ?? '',
    }
  }
  throw new Error('Invalid/unspecified auth type')
}

function queryParams() {
  const { username, password, authType } = useAppStore.getState().data

  return {
    ...authQueryParams(username, password, authType),
    v: '1.16.0',
    c: appName,
    f: 'json',
  }
}

function getUrl(path: string, options?: Record<string, string | undefined>) {
  const serverUrl = useAppStore.getState().data.url
  const params = new URLSearchParams(queryParams())

  if (options) {
    Object.keys(options).forEach((key) => {
      if (options[key] !== undefined) {
        params.append(key, options[key]!)
      }
    })
  }

  const queries = params.toString()
  const pathWithoutSlash = path.startsWith('/') ? path.substring(1) : path
  let url = `${serverUrl}/rest/${pathWithoutSlash}`
  url += path.includes('?') ? '&' : '?'
  url += queries

  return url
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
    const url = getUrl(path, options.query)

    if (isTauri()) {
      const tauriOptions = omit(options, 'query')
      return await rustFetch(url, { ...tauriOptions })
    } else {
      return await browserFetch<T>(url, {
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

export function getCoverArtUrl(
  id: string,
  type: CoverArt = 'album',
  size = '300',
): string {
  if (!id) {
    // everything except artists uses the same default cover art
    type = type === 'artist' ? 'artist' : 'album'
    return `/default_${type}_art.png`
  }
  return getUrl('getCoverArt', {
    id,
    size,
  })
}

export function getSongStreamUrl(
  id: string,
  maxBitRate?: string,
  format?: string,
) {
  return getUrl('stream', {
    id,
    maxBitRate,
    format,
    estimateContentLength: 'true',
  })
}

export function getDownloadUrl(id: string, maxBitRate = '0', format = 'raw') {
  return getUrl('download', {
    id,
    maxBitRate,
    format,
  })
}
