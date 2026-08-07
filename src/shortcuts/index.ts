import { isMacOs } from 'react-device-detect'
import { IShortcut } from '@/types/shortcuts'

const JOIN_SHORTCUTS_KEY = !isMacOs ? '+' : ''

const META_KEY = isMacOs ? '⌘' : 'Ctrl'
const META_TEXT = isMacOs ? 'cmd' : 'ctrl'
const CTRL_KEY = isMacOs ? '⌃' : 'Ctrl'
const SHIFT_KEY = isMacOs ? '⇧' : 'Shift'
const ALT_KEY = isMacOs ? '⌥' : 'Alt'

export const shortcutKeys = {
  META_KEY,
  META_TEXT,
  CTRL_KEY,
  SHIFT_KEY,
  ALT_KEY,
}

export const shortcutDialogKeys = [META_KEY, '/']
export const logoutKeys = [SHIFT_KEY, CTRL_KEY, 'Q']

export function stringifyShortcut(keys: string[]) {
  return keys.join(JOIN_SHORTCUTS_KEY)
}

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
  {
    label: 'shortcuts.playback.toggleFullscreen',
    shortcuts: ['Q'],
  },
]

const navigationShortcuts: IShortcut[] = [
  {
    label: 'settings.label',
    shortcuts: [META_KEY, ','],
  },
  {
    label: 'shortcuts.sidebar.toggle',
    shortcuts: [META_KEY, 'B'],
  },
]

const zoomShortcuts: IShortcut[] = [
  {
    label: 'shortcuts.zoom.in',
    shortcuts: [META_KEY, '+'],
  },
  {
    label: 'shortcuts.zoom.out',
    shortcuts: [META_KEY, '-'],
  },
  {
    label: 'shortcuts.zoom.reset',
    shortcuts: [META_KEY, '0'],
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
  {
    id: 'zoom',
    label: 'shortcuts.zoom.label',
    shortcuts: zoomShortcuts,
  },
]
