import { httpClient } from '@/api/httpClient'
import { SubsonicResponse } from '@/types/responses/subsonicResponse'
import dateTime from '@/utils/dateTime'

async function send(id: string) {
  await httpClient<SubsonicResponse>('/scrobble', {
    method: 'GET',
    query: {
      id,
      time: dateTime().valueOf().toString(),
    },
  })
}

export const scrobble = {
  send,
}
