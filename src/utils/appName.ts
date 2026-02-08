import { repository, version } from '@/../package.json'

export const appName = 'Aonsoku'

export function getAppInfo() {
  return {
    name: appName,
    version,
    url: repository.url,
    releaseUrl: `${repository.url}/releases/latest`,
  }
}

export const lrclibClient = `${appName} v${version} (${repository.url})`
