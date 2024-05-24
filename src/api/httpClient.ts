import { FetchOptions, fetch } from "@tauri-apps/api/http";

function getStoredConfig() {
  let url = localStorage.getItem("server-url")
  if (url?.slice(-1) === "/") {
    url = url.slice(0, -1)
  }

  const username = localStorage.getItem("server-username")
  const token = localStorage.getItem("server-token")
  const salt = localStorage.getItem("server-salt")
  
  return {
    url,
    username,
    token,
    salt
  }
}

function queryParams() {
  const { username, token, salt } = getStoredConfig()
  return {
    u: username ?? '',
    t: token ?? '',
    s: salt ?? '',
    v: '1.16.0',
    c: 'Subsonic-Player',
    f: 'json'
  }
}

export async function httpClient<T>(path: string, options: FetchOptions): Promise<T | undefined> {
  try {
    const { url } = getStoredConfig()
  
    const response: any = await fetch(`${url}/rest${path}`, {
      ...options,
      query: {
        ...options.query,
        ...queryParams()        
      }
    })

    if (response.ok) {
      return response.data['subsonic-response'] as T
    }
  } catch (error) {
    console.log('Error on httpClient request', error)
    return undefined
  }
}

export function getCoverArtUrl(id: string, size = '300') {
  const { url } = getStoredConfig()
  const baseUrl = `${url}/rest/getCoverArt`

  const params = {
    ...queryParams(),
    id,
    size
  }

  const queryString = new URLSearchParams(params).toString()
  const fullUrl = `${baseUrl}?${queryString}`

  return fullUrl
}

export function getSongStreamUrl(id: string) {
  const { url } = getStoredConfig()
  const baseUrl = `${url}/rest/stream`

  const params = {
    ...queryParams(),
    id,
    maxBitRate: '0',
    format: 'raw',
    estimateContentLength: 'true'
  }

  const queryString = new URLSearchParams(params).toString()
  const fullUrl = `${baseUrl}?${queryString}`

  return fullUrl
}