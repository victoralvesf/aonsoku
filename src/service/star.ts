import { httpClient } from '@/api/httpClient'
import { SubsonicResponse } from '@/types/responses/subsonicResponse'

async function starItem(id: string) {
  await httpClient<SubsonicResponse>('/star', {
    method: 'GET',
    query: {
      id,
    },
  })
}

async function unstarItem(id: string) {
  await httpClient<SubsonicResponse>('/unstar', {
    method: 'GET',
    query: {
      id,
    },
  })
}

interface HandleStarItem {
  id: string
  starred: boolean
}

async function handleStarItem({ id, starred }: HandleStarItem) {
  if (starred) {
    await unstarItem(id)
  } else {
    await starItem(id)
  }
}

export const star = {
  starItem,
  unstarItem,
  handleStarItem,
}
