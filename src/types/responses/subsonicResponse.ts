interface SubsonicResponseBase {
  status: string;
  version: string;
  type: string;
  serverVersion: string;
  openSubsonic: boolean;
}

export type SubsonicResponse<T = {}> = SubsonicResponseBase & T;