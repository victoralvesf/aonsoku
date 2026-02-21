import { httpClient } from '@/api/httpClient'
import { SubsonicResponse } from '@/types/responses/subsonicResponse'
import dateTime from '@/utils/dateTime'
import { logger } from '@/utils/logger'

async function send(id: string, submission = true) {
  logger.info(`${submission ? 'Scrobbling' : 'Syncing'} song with server`, {
    submission,
  })

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
