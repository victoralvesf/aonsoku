import { repository, version } from '@/../package.json'

export const appName = 'radioPABM'

export function getAppInfo() {
  return {
    name: appName,
    version,
    url: repository.url,
    tg_url: "https://t.me/pabm_new"
  }
}

export const lrclibClient = `${appName} v${version} (${repository.url})`
