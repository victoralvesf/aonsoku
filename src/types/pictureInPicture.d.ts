declare global {
  interface Window {
    documentPictureInPicture: {
      window: Window | null
      requestWindow: (options?: {
        width?: number
        height?: number
        disallowReturnToOpener?: boolean
        preferInitialWindowPlacement?: boolean
      }) => Promise<Window>
    }
  }
}

export {}
