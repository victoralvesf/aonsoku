import { httpClient } from "@/api/httpClient";
import { SubsonicResponse } from "@/types/responses/subsonicResponse";

async function starItem(id: string) {
  await httpClient<SubsonicResponse>('/star', {
    method: 'GET',
    query: {
      id,
    }
  })
}

async function unstarItem(id: string) {
  await httpClient<SubsonicResponse>('/unstar', {
    method: 'GET',
    query: {
      id,
    }
  })
}

export const star = {
  starItem,
  unstarItem
}
