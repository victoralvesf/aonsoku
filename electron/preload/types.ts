import { RpcPayload } from '../main/core/discordRpc'
import { IDownloadPayload } from '../main/core/downloads'
import { ISettingPayload } from '../main/core/settings'

export enum IpcChannels {
  FullscreenStatus = 'fullscreen-status',
  ToggleFullscreen = 'toggle-fullscreen',
  IsFullScreen = 'is-fullscreen',
  IsMaximized = 'is-maximized',
  MaximizedStatus = 'maximized-status',
  ToggleMaximize = 'toggle-maximize',
  ToggleMinimize = 'toggle-minimize',
  CloseWindow = 'close-window',
  ThemeChanged = 'theme-changed',
  UpdateNativeTheme = 'update-native-theme',
  HandleDownloads = 'handle-downloads',
  DownloadCompleted = 'download-completed',
  DownloadFailed = 'download-failed',
  UpdatePlayerState = 'update-player-state',
  PlayerStateListener = 'player-state-listener',
  SetDiscordRpcActivity = 'set-discord-rpc-activity',
  ClearDiscordRpcActivity = 'clear-discord-rpc-activity',
  SaveAppSettings = 'save-app-settings',
  CheckForUpdates = 'check-for-updates',
  DownloadUpdate = 'download-update',
  QuitAndInstall = 'quit-and-install',
  UpdateAvailable = 'update-available',
  UpdateNotAvailable = 'update-not-available',
  UpdateError = 'update-error',
  DownloadProgress = 'download-progress',
  UpdateDownloaded = 'update-downloaded',
}

export type OverlayColors = {
  color: string
  symbol: string
  bgColor: string
}

export type PlayerStatePayload = {
  isPlaying: boolean
  hasPrevious: boolean
  hasNext: boolean
  hasSonglist: boolean
}

export type PlayerStateListenerActions =
  | 'togglePlayPause'
  | 'skipBackwards'
  | 'skipForward'
  | 'toggleShuffle'
  | 'toggleRepeat'

type UpdateFileInfo = {
  url: string
  size?: number
  blockMapSize?: number
  readonly sha512: string
  readonly isAdminRightsRequired?: boolean
}

interface ReleaseNoteInfo {
  readonly version: string
  readonly note: string | null
}

type UpdateInfo = {
  readonly version: string
  readonly files: Array<UpdateFileInfo>
  releaseName?: string | null
  releaseNotes?: string | Array<ReleaseNoteInfo> | null
  releaseDate: string
  readonly stagingPercentage?: number
  readonly minimumSystemVersion?: string
}

export type UpdateCheckResult = {
  isUpdateAvailable: boolean
  updateInfo: UpdateInfo
}

export type ProgressInfo = {
  total: number
  delta: number
  transferred: number
  percent: number
  bytesPerSecond: number
}

export interface IAonsokuAPI {
  enterFullScreen: () => void
  exitFullScreen: () => void
  isFullScreen: () => Promise<boolean>
  fullscreenStatusListener: (func: (status: boolean) => void) => void
  removeFullscreenStatusListener: () => void
  isMaximized: () => Promise<boolean>
  maximizedStatusListener: (func: (status: boolean) => void) => void
  removeMaximizedStatusListener: () => void
  toggleMaximize: (isMaximized: boolean) => void
  toggleMinimize: () => void
  closeWindow: () => void
  setTitleBarOverlayColors: (colors: OverlayColors) => void
  setNativeTheme: (isDark: boolean) => void
  downloadFile: (payload: IDownloadPayload) => void
  downloadCompletedListener: (func: (fileId: string) => void) => void
  downloadFailedListener: (func: (fileId: string) => void) => void
  updatePlayerState: (payload: PlayerStatePayload) => void
  playerStateListener: (
    func: (action: PlayerStateListenerActions) => void,
  ) => void
  setDiscordRpcActivity: (payload: RpcPayload) => void
  clearDiscordRpcActivity: () => void
  saveAppSettings: (payload: ISettingPayload) => void
  checkForUpdates: () => Promise<UpdateCheckResult | null>
  downloadUpdate: () => void
  quitAndInstall: () => void
  onUpdateAvailable: (callback: (info: UpdateCheckResult) => void) => void
  onUpdateNotAvailable: (callback: () => void) => void
  onUpdateError: (callback: (error: string) => void) => void
  onDownloadProgress: (callback: (progress: ProgressInfo) => void) => void
  onUpdateDownloaded: (callback: (info: UpdateCheckResult) => void) => void
}
