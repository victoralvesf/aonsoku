interface SubsonicResponseBase {
  status: string
  version: string
  type: string
  serverVersion: string
  openSubsonic: boolean
}

export interface SubsonicJsonResponse {
  'subsonic-response': Record<string, string>
}

export type SubsonicResponse<T = Record<string, never>> = SubsonicResponseBase &
  T
