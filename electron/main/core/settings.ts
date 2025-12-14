import { AonsokuStore } from './store'

export interface ISettingPayload {
  minimizeToTray: boolean
}

const settingsStore = new AonsokuStore<ISettingPayload>({
  name: 'settings',
  defaults: {
    minimizeToTray: true,
  },
})

export function saveAppSettings(payload: ISettingPayload) {
  try {
    settingsStore.set(payload)
  } catch (error) {
    console.log('Unable to save app settings to store.', error)
  }
}

export function getAppSetting<T extends keyof ISettingPayload>(
  item: T,
): ISettingPayload[T] {
  return settingsStore.get(item)
}
