import omit from 'lodash/omit'
import { useAppStore } from '@/store/app.store'
import { isLinux } from '@/utils/osType'
import { isTauri } from '@/utils/tauriTools'
import { FetchOptions } from './httpClient'

function getBaseUrl() {
  const { serviceUrl } = useAppStore.getState().podcasts

  return serviceUrl
}

function getUrl(path: string) {
  const normalizedPath = path.startsWith('/') ? path.substring(1) : path
  const fullPath = `/api/${normalizedPath}`

  return new URL(fullPath, getBaseUrl())
}

function getAuthHeaders() {
  const appState = useAppStore.getState()
  const { useDefaultUser, customUser, customUrl } = appState.podcasts
  const { username, url } = appState.data

  if (useDefaultUser) {
    return {
      'APP-USERNAME': username,
      'APP-SERVER-URL': url,
    }
  }

  return {
    'APP-USERNAME': customUser,
    'APP-SERVER-URL': customUrl,
  }
}

export async function podcastClient<T>(
  path: string,
  options: FetchOptions,
): Promise<T | null> {
  try {
    const url = getUrl(path)

    if (options.query) {
      for (const [key, value] of Object.entries(options.query)) {
        if (value !== undefined) {
          url.searchParams.append(key, value.toString())
        }
      }
    }

    const requestOptions = omit(options, 'query')

    requestOptions.headers = {
      ...getAuthHeaders(),
      ...options.headers,
    }

    const response = await fetch(url, requestOptions)

    if (!response.ok) {
      let errorMessage = `Request failed with status ${response.status}: ${response.statusText}`

      try {
        const errorBody = await response.json()
        if (errorBody.message) {
          errorMessage = `${response.status} - ${errorBody.message}`
        }
      } catch {}

      console.error(errorMessage)
      throw new Error(errorMessage)
    }

    if (response.status === 204) {
      return null
    }

    return (await response.json()) as T
  } catch (error) {
    console.error('Error in podcastClient:', error)
    return null
  }
}

export function getProxyURL(url: string) {
  if (isTauri() && !isLinux) {
    const proxied = new URL('/proxy', 'http://127.0.0.1:12720')
    proxied.searchParams.append('url', url)

    return proxied.toString()
  }

  return url
}
