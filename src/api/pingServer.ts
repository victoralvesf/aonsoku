import { AuthType } from '@/types/serverConfig'
import { appName } from '@/utils/appName'
import { authQueryParams } from './httpClient'

export async function pingServer(
  url: string,
  user: string,
  password: string,
  authType: AuthType,
) {
  try {
    const query = {
      ...authQueryParams(user, password, authType),
      v: '1.16.0',
      c: appName,
      f: 'json',
    }

    const queries = new URLSearchParams(query).toString()

    const response = await fetch(`${url}/rest/ping.view?${queries}`, {
      method: 'GET',
    })
    const data = await response.json()

    return data['subsonic-response'].status === 'ok'
  } catch (_) {
    return false
  }
}
