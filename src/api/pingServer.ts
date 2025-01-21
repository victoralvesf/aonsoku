import { AuthType } from '@/types/serverConfig'
import { appName } from '@/utils/appName'
import { authQueryParams } from './httpClient'

export async function pingServer(
  url: string,
  user: string,
  password: string,
  authType: AuthType,
  protocolVersion?: string,
): Promise<boolean> {
  try {
    const query = {
      ...authQueryParams(user, password, authType),
      v: protocolVersion || '1.16.0',
      c: appName,
      f: 'json',
    }

    const queries = new URLSearchParams(query).toString()

    const response = await fetch(`${url}/rest/ping.view?${queries}`, {
      method: 'GET',
    })
    const data = await response.json()

    // Check if there's a version error (code 30)
    if (
      data['subsonic-response'].status === 'failed' &&
      data['subsonic-response'].error.code === 30 &&
      !protocolVersion
    ) {
      // Retry the request with the server's preferred version
      return await pingServer(
        url,
        user,
        password,
        authType,
        data['subsonic-response'].version,
      )
    }

    return data['subsonic-response'].status === 'ok'
  } catch (_) {
    return false
  }
}
