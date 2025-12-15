import { httpClient } from '@/api/httpClient'
import { SubsonicResponse } from '@/types/responses/subsonicResponse'
import dateTime from '@/utils/dateTime'

async function send(id: string, submission: boolean = true) {
  await httpClient<SubsonicResponse>('/scrobble', {
    method: 'GET',
    query: {
      id,
      submission: submission ? 'true' : 'false',
      time: dateTime().valueOf().toString(),
    },
  })
}

export const scrobble = {
  send,
}
