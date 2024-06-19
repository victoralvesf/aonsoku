import { FetchOptions, fetch as tauriFetch } from "@tauri-apps/api/http";

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

export async function httpClient<T>(path: string, options: FetchOptions): Promise<{ count: number, data: T } | undefined> {
  try {
    const { url } = getStoredConfig()
  
    let response: any
    
    if (window.__TAURI__) {
      response = await tauriFetch(`${url}/rest${path}`, {
        ...options,
        query: {
          ...options.query,
          ...queryParams()        
        }
      })
    } else {
      const queries = new URLSearchParams({
        ...options.query,
        ...queryParams()
      }).toString()

      let composedUrl = `${url}/rest${path}`
      if (path.includes('?')) {
        composedUrl += `&${queries}`
      } else {
        composedUrl += `?${queries}`
      }

      const data = await fetch(composedUrl, { method: options.method })

      response = {
        ok: data.ok,
        headers: {
          'x-total-count': data.headers.get('x-total-count'),
        },
        data: await data.json()
      }
    }


    if (response.ok) {
      return {
        count: response.headers['x-total-count'] || 0,
        data: response.data['subsonic-response'] as T
      }
    }
  } catch (error) {
    console.error('Error on httpClient request', error)
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