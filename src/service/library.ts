import { httpClient } from '@/api/httpClient'
import { ScanResponse } from '@/types/responses/library'

async function getScanStatus() {
  const response = await httpClient<ScanResponse>('/getScanStatus', {
    method: 'GET',
  })

  return response?.data.scanStatus
}

async function startScan() {
  const response = await httpClient<ScanResponse>('/startScan', {
    method: 'GET',
  })

  return response?.data.scanStatus
}

export const library = {
  getScanStatus,
  startScan,
}
