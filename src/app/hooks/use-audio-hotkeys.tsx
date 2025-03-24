import { HotkeyCallback, Keys, useHotkeys } from 'react-hotkeys-hook'
import { usePlayerCurrentList } from '@/store/player.store'

export function usePlayerHotkeys() {
  const currentList = usePlayerCurrentList()

  const useAudioHotkeys = (keys: Keys, callback: HotkeyCallback) => {
    useHotkeys(keys, callback, {
      preventDefault: true,
      enabled: currentList.length > 0,
    })
  }

  return {
    useAudioHotkeys,
  }
}
