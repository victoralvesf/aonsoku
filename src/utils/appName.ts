import { version, repository } from '@/../package.json'

export const appName = 'Aonsoku'

export function getAppInfo() {
  return {
    name: appName,
    version,
    url: repository.url,
  }
}
