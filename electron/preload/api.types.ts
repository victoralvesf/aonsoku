type IpcChannels = 'fullscreen-status'

export interface IAonsokuAPI {
  enterFullScreen: () => void
  exitFullScreen: () => void
  isFullScreen: () => Promise<boolean>
  receive: (channel: IpcChannels, func: (data: unknown) => void) => void
}
