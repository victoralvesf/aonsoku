import { httpClient } from '@/api/httpClient'
import { SubsonicResponse } from '@/types/responses/subsonicResponse'

async function pingInfo() {
  const response = await httpClient<SubsonicResponse>('/ping.view', {
    method: 'GET',
  })

  return response?.data
}

async function pingView() {
  try {
    const info = await pingInfo()

    return info?.status === 'ok'
  } catch (error) {
    console.error(error)
    return false
  }
}

export const ping = {
  pingInfo,
  pingView,
}
