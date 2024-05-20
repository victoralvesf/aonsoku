import { fetch } from "@tauri-apps/api/http"

export async function pingServer(url: string, user: string, token: string, salt: string) {
  try {
    const response: any = await fetch(`${url}/rest/ping.view`, {
      method: 'GET',
      query: {
        u: user,
        t: token,
        s: salt,
        v: '1.16.0',
        c: 'Subsonic-Player',
        f: 'json'
      }
    })
  
    if (response.data['subsonic-response'].status === 'ok') {
      return true
    } else {
      return false
    }
  } catch (_) {
    return false
  }
}