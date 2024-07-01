import { fetch as tauriFetch } from '@tauri-apps/api/http'
import { SubsonicJsonResponse } from '@/types/responses/subsonicResponse'
import { saltWord } from '@/utils/salt'
import { isTauri } from '@/utils/tauriTools'

export async function pingServer(url: string, user: string, token: string) {
  try {
    const query = {
      u: user,
      t: token,
      s: saltWord,
      v: '1.16.0',
      c: 'Subsonic-Player',
      f: 'json',
    }

    if (isTauri()) {
      const response = await tauriFetch(`${url}/rest/ping.view`, {
        method: 'GET',
        query,
      })
      const data = response.data as SubsonicJsonResponse

      return data['subsonic-response'].status === 'ok'
    } else {
      const queries = new URLSearchParams(query).toString()

      const response = await fetch(`${url}/rest/ping.view?${queries}`, {
        method: 'GET',
      })
      const data = await response.json()

      return data['subsonic-response'].status === 'ok'
    }
  } catch (_) {
    return false
  }
}
