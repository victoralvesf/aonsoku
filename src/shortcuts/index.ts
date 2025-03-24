import { isMacOs } from 'react-device-detect'
import { IShortcut } from '@/types/shortcuts'

const META_KEY = isMacOs ? '⌘' : 'Ctrl'

export const shortcutDialogKeys = [META_KEY, '/']

const playbackShortcuts: IShortcut[] = [
  {
    label: 'shortcuts.playback.play',
    shortcuts: ['Space'],
  },
  {
    label: 'shortcuts.playback.shuffle',
    shortcuts: [META_KEY, 'S'],
  },
  {
    label: 'shortcuts.playback.repeat',
    shortcuts: [META_KEY, 'R'],
  },
  {
    label: 'shortcuts.playback.previous',
    shortcuts: [META_KEY, '←'],
  },
  {
    label: 'shortcuts.playback.next',
    shortcuts: [META_KEY, '→'],
  },
  {
    label: 'shortcuts.playback.raiseVolume',
    shortcuts: [META_KEY, '↑'],
  },
  {
    label: 'shortcuts.playback.lowerVolume',
    shortcuts: [META_KEY, '↓'],
  },
]

const navigationShortcuts: IShortcut[] = [
  {
    label: 'settings.label',
    shortcuts: [META_KEY, ','],
  },
]

export const allShortcuts = [
  {
    id: 'playback',
    label: 'shortcuts.playback.label',
    shortcuts: playbackShortcuts,
  },
  {
    id: 'navigation',
    label: 'shortcuts.navigation.label',
    shortcuts: navigationShortcuts,
  },
]
