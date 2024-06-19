import { fetch as tauriFetch } from "@tauri-apps/api/http"

export async function pingServer(url: string, user: string, token: string, salt: string) {
  try {
    let response: any
    const query = {
      u: user,
      t: token,
      s: salt,
      v: '1.16.0',
      c: 'Subsonic-Player',
      f: 'json'
    }
    
    if (window.__TAURI__) {
      response = await tauriFetch(`${url}/rest/ping.view`, {
        method: 'GET',
        query
      })
    } else {
      const queries = new URLSearchParams(query).toString()

      const data = await fetch(`${url}/rest/ping.view?${queries}`, {
        method: 'GET'
      })

      response = {
        data: await data.json()
      }
    }

  
    if (response.data['subsonic-response'].status === 'ok') {
      return true
    } else {
      return false
    }
  } catch (_) {
    return false
  }
}