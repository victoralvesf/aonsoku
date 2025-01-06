import { AuthType } from '@/types/serverConfig'
import { appName } from '@/utils/appName'
import { authQueryParams } from './httpClient'


export async function queryServerInfo(
  url: string,
) {
  try {
    const query = {
      ...authQueryParams("dummy", "dummy", AuthType.PASSWORD), // Use dummy credentials, we don't want to actually be logged in
      v: '1.16.0',
      c: appName,
      f: 'json',
    }

    const queries = new URLSearchParams(query).toString()

    const response = await fetch(`${url}/rest/ping.view?${queries}`, {
      method: 'GET',
    })
    const data = await response.json()

    return {
      protocolVersion: data['subsonic-response'].version,
      serverType: data['subsonic-response'].type.toLowerCase() || "subsonic"
    }
  } catch (_) {
    return {
      protocolVersion: "1.16.0",
      serverType: "subsonic"
    }
  }
}
