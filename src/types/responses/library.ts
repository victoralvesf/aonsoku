import { SubsonicResponse } from './subsonicResponse'

export interface ScanStatus {
  scanning: string
  count: string
  folderCount?: string
  lastScan?: string
}

export interface ScanResponse
  extends SubsonicResponse<{ scanStatus: ScanStatus }> {}
