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

export async function httpClient<T>(path: string, options: FetchOptions): Promise<T | undefined> {
  try {
    const { url, username, token, salt } = getStoredConfig()
  
    const response: any = await fetch(`${url}/rest${path}`, {
      ...options,
      query: {
        ...options.query,
        u: username,
        t: token,
        s: salt,
        v: '1.16.0',
        c: 'Subsonic-Player',
        f: 'json'
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